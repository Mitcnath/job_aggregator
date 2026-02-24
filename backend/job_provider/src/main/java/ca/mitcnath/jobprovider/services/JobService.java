package ca.mitcnath.jobprovider.services;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import ca.mitcnath.jobprovider.beans.Job;
import ca.mitcnath.jobprovider.web.AdzunaResponse;

@Service
public class JobService {

	@Value("${adzuna.app_id}")
	private String appId;

	@Value("${adzuna.app_key}")
	private String appKey;
	
	@Value("${adzuna.base_url}")
	private String baseUrl;
	
	@Value("${adzuna.default_results_per_page}")
	private int resultsPerPage;
	
	@Autowired
	private RestTemplate restTemplate;

	@Tool(description = "Fetches 10 job listings from Adzuna API")
	public List<Job> getJobs() {
		String url = String.format("%s/search/1?app_id=%s&app_key=%s&results_per_page=%d",
				this.baseUrl, this.appId, this.appKey, this.resultsPerPage);
		AdzunaResponse response = restTemplate.getForObject(url, AdzunaResponse.class);
		return response != null ? response.getResults() : List.of();
	}


	@Tool(description = "Fetches job listings from Adzuna API based on job title and number of results per page is specified")
	public List<Job> getJobsByTitle(String title, int resultsPerPage, int page) {
		String url = String.format("%s/search/%d?app_id=%s&app_key=%s&results_per_page=%d&what=%s",
				this.baseUrl, page, this.appId, this.appKey, resultsPerPage, title);
		AdzunaResponse response = restTemplate.getForObject(url, AdzunaResponse.class);
		return (response != null && !response.getResults().isEmpty()) ? response.getResults() : null;
	}

	@Tool(description = "Fetches job listings from Adzuna API based on keyword and number of results per page is specified")
	public List<Job> getJobsByKeyword(String keyword, int resultsPerPage, int page) {
		String url = String.format("%s/search/%d?app_id=%s&app_key=%s&results_per_page=%d&what=%s",
				this.baseUrl, page, this.appId, this.appKey, resultsPerPage, keyword);
		AdzunaResponse response = restTemplate.getForObject(url, AdzunaResponse.class);
		return (response != null && !response.getResults().isEmpty()) ? response.getResults() : null;
	}

	
}