import pyttsx3
import argparse
import tempfile
from gtts import gTTS
from flask import Flask, render_template, request, send_file, send_from_directory
import requests
from pytube import YouTube
import assemblyai as aai
import pandas as pd
import youtube_dl
import os
from pydub import AudioSegment
import speech_recognition as sr
import csv
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from transformers import pipeline
import nltk
from nltk.tokenize import sent_tokenize
import time
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import deepl
from flask_cors import CORS
import whisper
from translate import Translator
from dotenv import load_dotenv

# import azure.cognitiveservices.speech as speechsdk
nltk.download('punkt')
app = Flask(__name__)
CORS(app)
load_dotenv()  # This loads the variables from .env

LANGUAGE_CODE_MAPPING = {
    "English": "EN-US",
    "Spanish": "ES",
    "French": "FR",
    "German": "DE",
    "Japanese": "JA",
    # Add other languages and their codes as necessary
}

GTTSLanguageCodeMapping = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Japanese": "ja",
    # Add other languages and their gTTS codes as necessary
}

def time_to_ms(time):
    return ((time.hour * 60 + time.minute) * 60 + time.second) * 1000 + time.microsecond / 1000


def generate_audio(mytext, language):
    # Convert full language name to gTTS language code
    gtts_lang_code = GTTSLanguageCodeMapping.get(language)
    if not gtts_lang_code:
        raise ValueError(f"Unsupported language for gTTS: {language}")

    # Generate the audio file using gTTS
    output_dir = os.path.join("src", "outputs")  # Path relative to the script location
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_path = os.path.join(output_dir, "output_audio.mp3")
    myobj = gTTS(text=mytext, lang=gtts_lang_code, slow=False)
    myobj.save(output_path)
    return output_path

# Function to download a YouTube video and return the audio filename


def download_audio(url):
    yt = YouTube(url)
    stream = yt.streams.filter(only_audio=True).first()
    audio_filename = "audio.mp3"  # Specify the desired file name
    audio_output_path = os.path.join("temp", audio_filename)

    # Create the temp directory if it doesn't exist
    if not os.path.exists("temp"):
        os.makedirs("temp")

    stream.download(output_path="temp", filename=audio_filename)
    return audio_output_path

def download_video(url):
    youtube = YouTube(url)
    video = youtube.streams.get_highest_resolution()
    video_filename = "video.mp4"  # Specify the desired file name
    video_output_path = os.path.join("temp", video_filename)

    # Create the temp directory if it doesn't exist
    if not os.path.exists("temp"):
        os.makedirs("temp")

    video.download(output_path="temp", filename=video_filename)
    return video_output_path

# Function to transcribe the audio file and return the transcript
def transcribe(audio_path):
    # Set your API token
    os.getenv('ASSEMBLY_AI_API_KEY')

    # Create a transcriber object
    transcriber = aai.Transcriber()

    # Transcribe the audio file
    transcript = transcriber.transcribe(audio_path)
    return transcript.text



def translate(paragraph, lang):
    
    # Map the full language name to a DeepL language code
    lang_code = GTTSLanguageCodeMapping.get(lang)
    translator = Translator(to_lang=lang_code)
    translation = translator.translate(paragraph)
    return translation


def generate_summary(paragraph):
    summarization_pipeline = pipeline(
        "summarization", model="sshleifer/distilbart-cnn-12-6")

    # Split the paragraph into smaller chunks
    max_chunk_length = 500  # Set the maximum chunk length
    chunks = [paragraph[i:i+max_chunk_length]
              for i in range(0, len(paragraph), max_chunk_length)]

    API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6"
    headers = {"Authorization": "Bearer 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"}

    # Generate summaries for each chunk
    summaries = []
    print("Starting Summarization")
    for chunk in chunks:
        payload = {
            "inputs": chunk,
            "max_length": 100,
            "min_length": 30
        }
        output = requests.post(API_URL, headers=headers, json=payload).json()[
            0]["summary_text"]
        print(output)
        summaries.append(output)

    # Combine the individual summaries into a single summary
    combined_summary = ' '.join(summaries)
    return combined_summary


def generate_bullet_points(summary):
    bullet_point_list = []
    sentences = sent_tokenize(summary)

    # Generate TF-IDF matrix
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sentences)

    # Get sentence scores based on TF-IDF values
    sentence_scores = tfidf_matrix.sum(axis=1)

    # Generate bullet points from sentences without sorting
    for sentence in sentences:
        bullet_point_list.append(f"- {sentence}")

    # Return the bullet point list
    return bullet_point_list


def refine_bullet_points(bullet_points):
    introductory_keywords = [
        "In this video",
        "Today, we'll be discussing",
        "Welcome back to",
        "Let's dive into",
        "In today's lesson",
        "I'm excited to share",
        "Before we begin",
        "This tutorial covers",
        "First, we'll start with",
        "In this lecture"
    ]

    refined_bullet_points = []
    for bullet_point in bullet_points:
        if not any(keyword in bullet_point for keyword in introductory_keywords):
            refined_bullet_points.append(bullet_point)

    return refined_bullet_points
# def translateSentence(words):
    # requests.post("https://libretranslate.com/translate", json="""{q: "How are you doing today?",source: "en",target: "es",format: "text", api_key: ""}   """)
#    return ""
# Home route

def send_to_openai(transcript):
    tokens = 4000-(len(transcript)//4)
    openai_url = 'https://api.openai.com/v1/completions'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': os.getenv('OPENAI_API_KEY')  # Replace with your API key
    }
    data = {
        'model': 'text-davinci-002',
        "prompt": f"take detailed notes on this video transcript for me but do it as an unordered list IN HTML. Wrap key ideas with the mark tag. Make sure to put a newline after each line. Make sure your response includes nothing other than the notes. Here is the video: {transcript}",
        "max_tokens":  3000,  # Adjust as needed
    }

    response = requests.post(openai_url, headers=headers, json=data)
    if response.status_code == 200:
        print(response.json()['choices'][0]['text'])
        return response.json()['choices'][0]['text']
    else:
        print(f"Error from OpenAI: {response.text}")
        return "Error in processing notes"

def flashcards(transcript):
    tokens = 4000-(len(transcript)//4)
    openai_url = 'https://api.openai.com/v1/completions'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': os.getenv('OPENAI_API_KEY')  # Replace with your API key
    }
    data = {
        'model': 'text-davinci-002',
        "prompt": 'Make flashcards out of this video transcript. Please return in the format {"question": the question, "answer": the answer} for each flashcard and SEPERATE EACH WITH A COMMA AND NEWLINE (essentially json formatted). Here is the video transcript: ' + transcript,
        "max_tokens":  3000,  # Adjust as needed
    }

    response = requests.post(openai_url, headers=headers, json=data)
    if response.status_code == 200:
        ai_response=response.json()['choices'][0]['text']
        print(ai_response)
        if ai_response[0]=='[':
            return ai_response
        else:
            return "[" + ai_response + "]"
    else:
        print(f"Error from OpenAI: {response.text}")
        return "Error in processing notes"
# Route for processing the YouTube video


@app.route('/process', methods=['POST'])
def process_video():
    try:
        # Get data from POST request body
        data = request.json
        youtube_link = data.get('youtube_link')
        lang = data.get('lang')

        if not youtube_link or not lang:
            return "No", 400  # Bad Request

        # Process the video and audio
        print("Starting Downloading")
        audio_filename = download_audio(youtube_link)
        video_filename = download_video(youtube_link)

        # Transcribe and translate the audio file
        print("Starting Transcription")
        transcript = transcribe(audio_filename)
        generate_audio(translate(transcript, lang), lang)

        # Send transcript to OpenAI for processing
        openai_response = send_to_openai(transcript)
        flashcard_response = json.loads(flashcards(transcript))

        # If everything goes well, return notes
        return {"notes": translate(openai_response, lang),
                "flashcards": flashcard_response}, 200  # OK

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"An error occurred: {e}")

        # Return "No" in case of any exception
        return "No", 500  # Internal Server Error



@app.route('/outputs/<filename>')
def serve_file(filename):
    output_dir = os.path.join("src", "outputs")  # Path relative to the script location
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    return send_from_directory('../src/outputs', filename)



if __name__ == '__main__':
    app.run()
