# MinuteAI

**MinuteAI** primarily focuses on **How well a person can handle Post-Meeting Works**. It includes works like Generation of Minutes of Meeting or Action Items reference or Summary of the Meeting that has happened.

In our Daily Lives, these tasks catch up lot of a time, but you don't need to worry.... This job is taken care by our Application...

It's a Free to Use, Open Source application...


# To Run the application:
    **Follow These Steps:**
Step 1: Clone the Repository into your local directory
Step 2: Make sure that the dependencies are correctly installed and available in your system
Step 3: Also Do not forget to install the genkit package
Step 4:
Now proceed to open 2 terminals side by side wherein in:
 a) In the 1st terminal run this command:
     ```bash npm run dev
     ```
 b) In the 2nd terminal run this command:
     ```bash npm run genkit:dev
     ```
Note: Ensure to add a file named **.env** in your directory:
    Inside it type this:
         GEMINI_API_KEY=<your_api_key> <---------------Copy Paste the API key here
                                                                 |
                                                                 |                                                             
If you don't have one go to https://aistudio.google.com  and create a project.

# If you get error:

**Related to genkit**: Stop all the servers, Check whether you have updated your npm to the latest version and then check whether the above step is done... Then restart the server again

# Feel to Suggest updations and upgrades.. Also do give a pull request wherever possible
