"""
Skills Database Configuration
Contains comprehensive list of technical skills for resume parsing
"""

# Programming Languages
PROGRAMMING_LANGUAGES = [
    'python', 'javascript', 'java', 'c++', 'c#', 'typescript', 'go', 'rust',
    'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl',
    'dart', 'c', 'objective-c', 'groovy', 'lua', 'shell', 'bash'
]

# Frontend Technologies
FRONTEND_TECH = [
    'react', 'vue', 'angular', 'html', 'css', 'tailwind', 'bootstrap',
    'next.js', 'nuxt', 'redux', 'webpack', 'sass', 'less', 'svelte',
    'jquery', 'backbone.js', 'ember.js', 'material-ui', 'chakra ui'
]

# Backend Technologies
BACKEND_TECH = [
    'node.js', 'express', 'django', 'flask', 'fastapi', 'spring boot',
    'asp.net', 'laravel', 'rails', 'nest.js', 'koa', 'hapi',
    'gin', 'echo', 'actix', 'axum'
]

# Databases
DATABASES = [
    'mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'oracle',
    'cassandra', 'dynamodb', 'elasticsearch', 'neo4j', 'couchdb',
    'mariadb', 'mssql', 'firebase', 'supabase'
]

# Cloud & DevOps
CLOUD_DEVOPS = [
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
    'git', 'github', 'gitlab', 'ci/cd', 'terraform', 'ansible',
    'circleci', 'travis ci', 'bitbucket', 'heroku', 'vercel',
    'netlify', 'cloudflare', 'nginx', 'apache'
]

# Mobile Development
MOBILE_DEV = [
    'android', 'ios', 'react native', 'flutter', 'xamarin',
    'ionic', 'cordova', 'swift', 'kotlin'
]

# Data Science & ML
DATA_SCIENCE_ML = [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'scikit-learn', 'pandas', 'numpy', 'jupyter', 'keras',
    'opencv', 'nltk', 'spacy', 'transformers', 'langchain',
    'data analysis', 'data visualization', 'tableau', 'power bi'
]

# Other Technologies
OTHER_TECH = [
    'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum',
    'linux', 'windows', 'macos', 'websocket', 'grpc', 'rabbitmq',
    'kafka', 'celery', 'pytest', 'jest', 'mocha', 'selenium',
    'cypress', 'postman', 'swagger', 'oauth', 'jwt', 'blockchain',
    'web3', 'solidity', 'ethereum'
]

# Combine all skills
ALL_SKILLS = (
    PROGRAMMING_LANGUAGES + 
    FRONTEND_TECH + 
    BACKEND_TECH + 
    DATABASES + 
    CLOUD_DEVOPS + 
    MOBILE_DEV + 
    DATA_SCIENCE_ML + 
    OTHER_TECH
)

# Remove duplicates and sort
ALL_SKILLS = sorted(list(set(ALL_SKILLS)))

# For easier categorization later
SKILL_CATEGORIES = {
    'programming': PROGRAMMING_LANGUAGES,
    'frontend': FRONTEND_TECH,
    'backend': BACKEND_TECH,
    'database': DATABASES,
    'cloud_devops': CLOUD_DEVOPS,
    'mobile': MOBILE_DEV,
    'data_science': DATA_SCIENCE_ML,
    'other': OTHER_TECH
}

