"""
Information Extractor Module
Extracts structured information from resume text
"""

import re
from config.skills_database import ALL_SKILLS


class InformationExtractor:
    """Extract structured information from resume text"""
    
    def __init__(self):
        self.skills_database = ALL_SKILLS
    
    def extract_skills(self, text):
        """
        Find skills in text using keyword matching
        
        Args:
            text: Resume text content
            
        Returns:
            list: Found skills sorted alphabetically
        """
        if not text:
            return []
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in self.skills_database:
            # Use word boundaries to avoid partial matches
            # e.g., "react" won't match "create"
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        
        # Remove duplicates and sort
        return sorted(list(set(found_skills)))
    
    def extract_email(self, text):
        """
        Extract email address using regex
        
        Args:
            text: Resume text content
            
        Returns:
            str or None: First email found or None
        """
        if not text:
            return None
        
        # Comprehensive email regex pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        
        # Return first valid email
        if emails:
            # Filter out common false positives
            valid_emails = [e for e in emails if not e.endswith('.png') 
                           and not e.endswith('.jpg')]
            return valid_emails[0] if valid_emails else None
        
        return None
    
    def extract_phone(self, text):
        """
        Extract phone number - supports multiple formats
        
        Args:
            text: Resume text content
            
        Returns:
            str or None: First phone found or None
        """
        if not text:
            return None
        
        # Multiple phone number patterns
        phone_patterns = [
            r'[\+]?91[-\s]?[6-9]\d{9}',  # Indian: +91 9876543210
            r'[6-9]\d{9}',  # Indian without code: 9876543210
            r'\(\d{3}\)[-\s]?\d{3}[-\s]?\d{4}',  # US: (123) 456-7890
            r'\d{3}[-\s]\d{3}[-\s]\d{4}',  # US: 123-456-7890
            r'\+\d{1,3}[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}',  # International
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                return phones[0]
        
        return None
    
    def extract_name(self, text):
        """
        Attempt to extract name from resume
        Usually first line or after 'Resume' keyword
        
        Args:
            text: Resume text content
            
        Returns:
            str or None: Extracted name or None
        """
        if not text:
            return None
        
        lines = text.strip().split('\n')
        
        # Look for name in first few lines
        for line in lines[:5]:
            line = line.strip()
            
            # Skip common resume headers
            if any(keyword in line.lower() for keyword in 
                   ['resume', 'curriculum vitae', 'cv', 'page', 'contact']):
                continue
            
            # Name usually 2-4 words, proper case
            words = line.split()
            if 2 <= len(words) <= 4 and line[0].isupper():
                # Check if looks like a name (no special chars except .)
                if re.match(r'^[A-Z][a-z]+(\s[A-Z][a-z.]+)+$', line):
                    return line
        
        return None
    
    def extract_urls(self, text):
        """
        Extract URLs (LinkedIn, GitHub, portfolio, etc.)
        
        Args:
            text: Resume text content
            
        Returns:
            dict: Dictionary of found URLs by type
        """
        if not text:
            return {}
        
        urls = {}
        
        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            urls['linkedin'] = 'https://' + linkedin.group(0)
        
        # GitHub
        github_pattern = r'github\.com/[\w-]+'
        github = re.search(github_pattern, text, re.IGNORECASE)
        if github:
            urls['github'] = 'https://' + github.group(0)
        
        # Portfolio/Website (general URL)
        url_pattern = r'https?://(?:www\.)?[\w\.-]+\.\w+/?[\w\.-]*'
        all_urls = re.findall(url_pattern, text, re.IGNORECASE)
        if all_urls:
            # Filter out LinkedIn and GitHub (already captured)
            portfolio_urls = [u for u in all_urls 
                            if 'linkedin.com' not in u and 'github.com' not in u]
            if portfolio_urls:
                urls['portfolio'] = portfolio_urls[0]
        
        return urls
    
    def extract_years_of_experience(self, text):
        """
        Estimate years of experience from text
        
        Args:
            text: Resume text content
            
        Returns:
            int or None: Estimated years of experience
        """
        if not text:
            return None
        
        # Look for explicit mentions like "5 years of experience"
        exp_pattern = r'(\d+)[\s\-+]+years?\s+(?:of\s+)?experience'
        matches = re.findall(exp_pattern, text, re.IGNORECASE)
        
        if matches:
            # Return the highest number found
            return max([int(m) for m in matches])
        
        # Alternatively, count date ranges (rough estimate)
        # e.g., "2018-2020", "Jan 2019 - Dec 2021"
        year_pattern = r'(19|20)\d{2}'
        years = re.findall(year_pattern, text)
        
        if len(years) >= 2:
            years_int = [int(y) for y in years]
            # Rough estimate: span of years
            return max(years_int) - min(years_int)
        
        return None
    
    def extract_education(self, text):
        """
        Extract education information
        
        Args:
            text: Resume text content
            
        Returns:
            list: List of education entries
        """
        if not text:
            return []
        
        education = []
        
        # Common degree patterns
        degrees = [
            r'\b(B\.?Tech|Bachelor of Technology)\b',
            r'\b(B\.?E\.?|Bachelor of Engineering)\b',
            r'\b(M\.?Tech|Master of Technology)\b',
            r'\b(M\.?E\.?|Master of Engineering)\b',
            r'\b(B\.?Sc\.?|Bachelor of Science)\b',
            r'\b(M\.?Sc\.?|Master of Science)\b',
            r'\b(B\.?A\.?|Bachelor of Arts)\b',
            r'\b(M\.?A\.?|Master of Arts)\b',
            r'\b(MBA|Master of Business Administration)\b',
            r'\b(BBA|Bachelor of Business Administration)\b',
            r'\b(Ph\.?D\.?|Doctorate)\b',
            r'\b(B\.?Com\.?|Bachelor of Commerce)\b',
            r'\b(M\.?Com\.?|Master of Commerce)\b',
        ]
        
        # Look for education section
        education_keywords = ['education', 'academic', 'qualification', 'degree']
        lines = text.split('\n')
        
        in_education_section = False
        current_entry = {}
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Detect education section start
            if any(keyword in line_lower for keyword in education_keywords):
                in_education_section = True
                continue
            
            # Stop at next section
            if in_education_section and any(keyword in line_lower for keyword in 
                ['experience', 'work history', 'projects', 'skills', 'certifications']):
                if current_entry:
                    education.append(current_entry)
                break
            
            if in_education_section:
                # Check for degree
                for degree_pattern in degrees:
                    if re.search(degree_pattern, line, re.IGNORECASE):
                        if current_entry:
                            education.append(current_entry)
                        current_entry = {
                            'degree': re.search(degree_pattern, line, re.IGNORECASE).group(0),
                            'institution': '',
                            'year': '',
                            'field': ''
                        }
                        
                        # Try to extract field of study from same line
                        field_match = re.search(r'in\s+([A-Z][a-zA-Z\s&]+)', line)
                        if field_match:
                            current_entry['field'] = field_match.group(1).strip()
                
                # Extract year (4 digits)
                year_match = re.search(r'\b(19|20)\d{2}\b', line)
                if year_match and current_entry:
                    current_entry['year'] = year_match.group(0)
                
                # Institution (usually capitalized words)
                if current_entry and not current_entry['institution']:
                    # Look for capitalized multi-word names
                    inst_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+){2,})', line)
                    if inst_match:
                        current_entry['institution'] = inst_match.group(0)
        
        if current_entry:
            education.append(current_entry)
        
        return education
    
    def extract_experience(self, text):
        """
        Extract work experience information
        
        Args:
            text: Resume text content
            
        Returns:
            list: List of work experience entries
        """
        if not text:
            return []
        
        experience = []
        
        # Look for experience section
        experience_keywords = ['experience', 'work history', 'employment', 'professional background']
        lines = text.split('\n')
        
        in_experience_section = False
        current_entry = {}
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Detect experience section start
            if any(keyword in line_lower for keyword in experience_keywords):
                in_experience_section = True
                continue
            
            # Stop at next section
            if in_experience_section and any(keyword in line_lower for keyword in 
                ['education', 'skills', 'projects', 'certifications', 'achievements']):
                if current_entry:
                    experience.append(current_entry)
                break
            
            if in_experience_section and line.strip():
                # Look for date patterns (2020-2022, Jan 2020 - Dec 2022)
                date_pattern = r'\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\b|\bPresent\b|\bCurrent\b'
                duration_match = re.search(date_pattern, line, re.IGNORECASE)
                
                if duration_match:
                    if current_entry:
                        experience.append(current_entry)
                    current_entry = {
                        'position': '',
                        'company': '',
                        'duration': duration_match.group(0)
                    }
                
                # Common position titles
                position_keywords = ['engineer', 'developer', 'analyst', 'manager', 'intern', 
                                   'consultant', 'designer', 'lead', 'architect', 'specialist']
                if current_entry and not current_entry['position']:
                    if any(keyword in line_lower for keyword in position_keywords):
                        current_entry['position'] = line.strip()
                
                # Company name (usually after "at" or "@")
                company_match = re.search(r'(?:at|@)\s+([A-Z][a-zA-Z\s&.,]+)', line)
                if company_match and current_entry:
                    current_entry['company'] = company_match.group(1).strip()
        
        if current_entry:
            experience.append(current_entry)
        
        return experience
    
    def extract_certifications(self, text):
        """
        Extract certifications
        
        Args:
            text: Resume text content
            
        Returns:
            list: List of certifications
        """
        if not text:
            return []
        
        certifications = []
        
        # Common certification keywords
        cert_keywords = ['certification', 'certificate', 'certified', 'license']
        
        # Common certifications
        common_certs = [
            'AWS Certified', 'Azure', 'Google Cloud', 'PMP', 'CISSP',
            'CompTIA', 'Scrum Master', 'Six Sigma', 'ITIL', 'Oracle Certified'
        ]
        
        lines = text.split('\n')
        in_cert_section = False
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Detect certification section
            if any(keyword in line_lower for keyword in cert_keywords):
                in_cert_section = True
                continue
            
            # Stop at next section
            if in_cert_section and any(keyword in line_lower for keyword in 
                ['experience', 'education', 'skills', 'projects']):
                break
            
            if in_cert_section and line.strip():
                # Look for common certifications
                for cert in common_certs:
                    if cert.lower() in line_lower:
                        certifications.append({
                            'name': line.strip(),
                            'issuer': cert.split()[0] if ' ' in cert else cert
                        })
                        break
                else:
                    # Generic certification entry
                    if line.strip() and len(line.strip()) > 5:
                        certifications.append({
                            'name': line.strip(),
                            'issuer': ''
                        })
        
        return certifications
    
    def extract_location(self, text):
        """
        Extract location/address
        
        Args:
            text: Resume text content
            
        Returns:
            str or None: Location string
        """
        if not text:
            return None
        
        # Common Indian cities
        cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
            'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
            'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
            'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
            'Noida', 'Gurugram', 'Gurgaon'
        ]
        
        # Look for city names
        for city in cities:
            if re.search(r'\b' + city + r'\b', text, re.IGNORECASE):
                # Try to get state/country with it
                location_pattern = rf'\b{city}[,\s]+([A-Z][a-zA-Z\s]+)'
                match = re.search(location_pattern, text, re.IGNORECASE)
                if match:
                    return match.group(0)
                return city
        
        return None
    
    def extract_all(self, text):
        """
        Extract all information at once
        
        Args:
            text: Resume text content
            
        Returns:
            dict: Dictionary containing all extracted information
        """
        return {
            'name': self.extract_name(text),
            'email': self.extract_email(text),
            'phone': self.extract_phone(text),
            'location': self.extract_location(text),
            'skills': self.extract_skills(text),
            'education': self.extract_education(text),
            'experience': self.extract_experience(text),
            'certifications': self.extract_certifications(text),
            'urls': self.extract_urls(text),
            'years_of_experience': self.extract_years_of_experience(text),
        }

