
def categorize(text: str):
    text = text.lower()

    # Food
    if any(word in text for word in ["swiggy", "zomato", "food", "restaurant", "pizza", "burger"]):
        return "Food"

    # Travel
    elif any(word in text for word in ["uber", "ola", "bus", "train", "auto", "cab"]):
        return "Travel"

    # Shopping
    elif any(word in text for word in ["amazon", "flipkart", "shopping", "clothes", "shoes"]):
        return "Shopping"

    # Entertainment
    elif any(word in text for word in ["movie", "netflix", "youtube", "game"]):
        return "Entertainment"

    # Rent
    elif any(word in text for word in ["rent", "room", "flat"]):
        return "Rent"

    # Bills
    elif any(word in text for word in ["electricity", "bill", "recharge", "wifi"]):
        return "Bills"

    # Education
    elif any(word in text for word in ["book", "course", "college", "fees"]):
        return "Education"

    # Health
    elif any(word in text for word in ["doctor", "medicine", "hospital"]):
        return "Health"

    return "Others"