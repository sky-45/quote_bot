# READMEEEE

### SUMMARY

This is a simple discord bot written in JS, the summary about the current technology stack and the multiple integrationsare as follows:

- NODE JS: Framework for Backend server.
- Database: MongoDB as Database, currently hosted on MongoDB Atlas, to manage user statistics, user messages, calendar scheduled activities and points systems.
- Cache: Local Redis instance deployed on docker as fast access DB.
- Deployment: Current deployment and monitoring is based on docker, on top of an ARM Oracle VM. 
- Integrations:
  - Integration with local currency API to fetch goverment issued exchange rate in Peru.
  - Integration with Ollama running also on docker, for simple chatbot capabilities (default using llama3:8b LLM Model).
  - Integration with Twitch API to fetch current live channels.
  - Integration with a Joke API, also deployed on docker, to scrap Jokes from different source

### TODO / New Ideas

New ideas are always welcome, the currently new Ideas are planned to be implemented:

-  Web UI to track top users in discord channe.
- Retrain chatbot with spanish corpus.
- Integrate more chatbot capabilities
- Integrate more LLM capabilities like image/video/audio generation.
- Migrate from a simple docker based infrastructure to an k8s cluster, to avoid downtimes when there is errors on cloud provider VM.
- Deploy in a multi cloud infrastructure, currently on Oracle Cloud.