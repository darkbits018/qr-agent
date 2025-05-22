import spacy

try:
    nlp = spacy.load("models/food_ner")
except:
    nlp = spacy.load("en_core_web_sm")
