import spacy 

# Load NLP model
nlp = spacy.load("en_core_web_sm")

def categorize(text: str):
    doc = nlp(text.lower())

    words = [token.text for token in doc]

    # Food
    if any(word in words for word in ["food", "pizza", "burger", "restaurant", "swiggy", "zomato"]):
        return "Food"

    # Travel
    elif any(word in words for word in ["travel", "uber", "ola", "bus", "train", "auto"]):
        return "Travel"

    # Shopping
    elif any(word in words for word in ["shopping", "amazon", "flipkart", "clothes", "shoes"]):
        return "Shopping"

    # Entertainment
    elif any(word in words for word in ["movie", "netflix", "game", "youtube"]):
        return "Entertainment"

    # Rent
    elif any(word in words for word in ["rent", "flat", "room"]):
        return "Rent"

    # Bills
    elif any(word in words for word in ["bill", "electricity", "wifi", "recharge"]):
        return "Bills"

    # Education
    elif any(word in words for word in ["book", "course", "college", "fees"]):
        return "Education"

    # Health
    elif any(word in words for word in ["doctor", "medicine", "hospital"]):
        return "Health"

    return "Others"