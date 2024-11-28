import os
import google.generativeai as genai

# API anahtarınızı çevresel değişken olarak alıyoruz
api_key = os.getenv("GOOGLE_API_KEY")






if not api_key:
    raise ValueError("Please set the GOOGLE_API_KEY environment variable")

# API anahtarını yapılandırıyoruz
genai.configure(api_key=api_key)

# Modeli başlatıyoruz
model = genai.GenerativeModel("gemini-1.5-flash")

# Çok satırlı metni tanımlıyoruz
story_description = """
Generate a complete and detailed JSON representation of a family pedigree tree based on the following description. The entire family tree should be output as a single, cohesive JSON object, with no truncation or omissions. 
For every family member, including children, ensure that all required attributes are provided, even if the specific details are unknown (such as unknown for health status or unknown for gender). The tree structure should follow these rules:

The tree should begin with the top-level ancestors and progress downward, with each parent pair (husband and wife) appearing at the same level, and their children shifted downward.
Each individual in the family must include the following attributes:
name (string): Full name of the person.
gender (string): Male or female (if unknown, use "unknown").
marital_status (string): Single, married, or widowed.
alive (boolean): True if the person is alive, false if deceased.
health_status (string): Healthy, diabetic (DM patient), or unknown (if unknown, use "unknown").
notes (string): Any additional information or comments.
For all instances where children are mentioned (e.g., "Mehmet and Meryem have 4 children"), include four children with placeholder values. Do not use comment-style explanations like "4 children to be added here". Instead, add entries for each child with default values where the details are unknown. The gender, health status, and names can be set as "unknown" where necessary.
Family Description:

Ali (healthy male) married Elif (healthy female), and they had eight children:Cengiz (male, deceased as an infant, unknown health status).
Halil (male, deceased as an infant, unknown health status).
Nazire (healthy female) married Ali (healthy male) and had six children, two of whom have diabetes.
Kezban (healthy female) married Yusuf (healthy male) and had eight children, two of whom died as infants (unknown reasons).
Hediye (female, diabetic) married Yusuf (healthy male), and they had one healthy child.
Bekir (male, diabetic) married Gülhan, and they had three healthy children.
Yusuf (healthy male) married Rabia (healthy female), and they had three healthy children.
Mehmet (male, diabetic) married Meryem (healthy female), and they had four children:Child 1: Gender: unknown, Health status: unknown
Child 2: Gender: unknown, Health status: unknown
Child 3: Gender: unknown, Health status: unknown
Child 4: Gender: unknown, Health status: unknown
Zehra (female) married Mehmet (diabetic male) and had four children:Ali (diabetic male, unmarried, has a daughter with diabetes).
Aytaç (diabetic male) married Hacer (healthy female), and they had four healthy children.
Gönül (diabetic female, single).
Şevket (healthy male) married Sultan, and they had two healthy children.
Ensure that the output is a single, cohesive JSON object with all individuals and relationships included. Do not leave any comment-style placeholders like "4 children to be added here" — instead, provide concrete entries for each child, using default or "unknown" values where applicable.

"""

# Modeli kullanarak içeriği oluşturuyoruz
response = model.generate_content(story_description)

# Yanıtı yazdırıyoruz
print(response.text)

#export GOOGLE_API_KEY="AIzaSyB0exwU5sT2vHPC1YbLKbgZUkVW1ZxlW6g"
#python codegeex_try.py
