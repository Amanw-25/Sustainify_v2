import os
import sys
import json
import requests
from typing import Dict, Any, List

def extract_points(section_text: str) -> List[str]:
    """Extract bullet points from a section."""
    points = []
    for line in section_text.split('\n'):
        line = line.strip()
        if line.startswith('-'):
            points.append(line[1:].strip())
    return points

def process_mistral_response(content: str) -> Dict[str, List[str]]:
    """Process and structure the Mistral AI response."""
    # Initialize with empty lists for all required sections
    structured_response = {
        "keyInsights": [],
        "actionableTips": [],
        "mainContributorAnalysis": [],
        "precautionaryMeasures": [],
        "comparisonWithBenchmarks": []
    }
    
    # Split content into sections
    sections = content.split("\n\n")
    current_section = None
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
        
        # Map section titles to response keys
        section_mapping = {
            "Key Insights:": "keyInsights",
            "Actionable Tips:": "actionableTips",
            "Main Contributor Analysis:": "mainContributorAnalysis",
            "Precautionary Measures:": "precautionaryMeasures",
            "Comparison with Benchmarks:": "comparisonWithBenchmarks"
        }
        
        # Find the matching section
        for title, key in section_mapping.items():
            if title in section:
                # Extract the content after the title
                content_part = section.split(title)[1].strip()
                # Extract all points that start with -
                points = extract_points(content_part)
                if points:
                    structured_response[key] = points
                    break
    
    # Ensure minimum content for each section
    for key in structured_response:
        if not structured_response[key]:
            structured_response[key] = ["No data available for this section"]
    
    return structured_response

def get_mistral_response(question: str) -> Dict[Any, Any]:
    """Make a request to the Mistral AI API and return the response."""
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY not found in environment variables")

    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    data = {
        "model": "mistral-small",
        "messages": [
            {
                "role": "user",
                "content": question,
            },
        ],
    }

    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()

def main():
    try:
        if len(sys.argv) < 2:
            raise ValueError("No question provided")
        
        question = sys.argv[1]
        result = get_mistral_response(question)
        content = result['choices'][0]['message']['content']
        
        # Process and structure the content
        structured_content = process_mistral_response(content)
        
        # Prepare the response
        ai_response = {
            "status": "success",
            "data": structured_content
        }
        
        print(json.dumps(ai_response, ensure_ascii=False, indent=2))
        
    except Exception as e:
        error_response = {
            "status": "error",
            "error": str(e),
            "type": type(e).__name__
        }
        print(json.dumps(error_response, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()