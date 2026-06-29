from datetime import datetime


def current_month():
    return datetime.now().strftime("%Y-%m")
