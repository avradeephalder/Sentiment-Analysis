import sys
import json
import os
from pathlib import Path
import warnings

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['PYTHONWARNINGS'] = 'ignore'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Suppress transformers warnings
os.environ['TRANSFORMERS_VERBOSITY'] = 'error'

def predict_sentiment_roberta(text, model, tokenizer):
    """Predict sentiment using RoBERTa model"""
    from scipy.special import softmax
    
    # Tokenize and predict
    encoded = tokenizer(
        text, 
        return_tensors='pt', 
        truncation=True, 
        max_length=512,
        padding=True
    )
    
    # Get model output
    output = model(**encoded)
    scores = output.logits[0].detach().numpy()
    scores = softmax(scores)
    
    # scores[0] = negative, scores[1] = neutral, scores[2] = positive
    negative_score = float(scores[0])
    neutral_score = float(scores[1])
    positive_score = float(scores[2])
    
    # Determine sentiment (ignore neutral, just pos/neg for compatibility)
    if positive_score > negative_score:
        sentiment = "positive"
        confidence = positive_score * 100
    else:
        sentiment = "negative"
        confidence = negative_score * 100
    
    return sentiment, round(confidence, 2)


def main():
    try:
        script_dir = Path(__file__).parent
        model_path = script_dir / 'roberta_sentiment'
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model directory not found: {model_path}")
        
        # Load model and tokenizer with warnings suppressed
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            
            from transformers import AutoTokenizer, AutoModelForSequenceClassification
            import logging
            
            # Disable transformers logging
            logging.getLogger("transformers").setLevel(logging.ERROR)
            
            tokenizer = AutoTokenizer.from_pretrained(
                str(model_path),
                local_files_only=True
            )
            model = AutoModelForSequenceClassification.from_pretrained(
                str(model_path),
                local_files_only=True
            )
        
        if len(sys.argv) < 2:
            raise ValueError("No input text provided")
        
        input_text = sys.argv[1]
        sentiment, confidence = predict_sentiment_roberta(input_text, model, tokenizer)
        
        result = {
            "sentiment": sentiment,
            "confidence": confidence
        }
        
        # Print ONLY the JSON
        print(json.dumps(result))
        sys.stdout.flush()
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "sentiment": "neutral",
            "confidence": 0
        }
        print(json.dumps(error_result))
        sys.stdout.flush()
        sys.exit(1)


if __name__ == "__main__":
    main()
