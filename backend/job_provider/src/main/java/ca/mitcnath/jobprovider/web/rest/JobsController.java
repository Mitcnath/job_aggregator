package ca.mitcnath.jobprovider.web.rest;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ca.mitcnath.jobprovider.beans.Job;
import ca.mitcnath.jobprovider.services.JobService;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobsController {

	private final ChatClient chatClient;

	@Autowired
	private JobService jobService;

	public JobsController(ChatClient.Builder chatClientBuilder, JobService jobService) {

		this.jobService = jobService;

		this.chatClient = chatClientBuilder.defaultSystem(
				"You are a Career Intelligence Analyst. Use the provided tools to find real data. Always fetch 100 jobs by default if you are required to or are in-need of job posting data. Never ask the user how many jobs to fetch but if they specify that information that use it instead. Identify skill gaps and provide actionable insights. Use professional language at all times. Be clear and concise to ensure the user understands exactly what is being said and that their question is appropiately answered. Always use the tools at your disposal to find real data and never make up information. If you don't know the answer to a question, use the tools to find the answer. If you need more information on the job posting description be sure to follow the redirect url to get the full job description and requirements. You are only allowed to use the tools provided to you and you have access to real-time data.")
				.defaultTools(jobService).build();
	}

	// Test endpoint to verify that the service is working
	@GetMapping("/test")
	public List<Job> getJobs() {
		return jobService.getJobs();
	}

	@GetMapping("/search_by_title")
	public List<Job> searchJobs(@RequestParam String title, @RequestParam(defaultValue = "10") int resultsPerPage,
			@RequestParam(defaultValue = "1") int page) {
		return jobService.getJobsByTitle(title, resultsPerPage, page);
	}

	@GetMapping("/search_by_keyword")
	public List<Job> searchJobsByKeyword(@RequestParam String keyword,
			@RequestParam(defaultValue = "10") int resultsPerPage, @RequestParam(defaultValue = "1") int page) {
		return jobService.getJobsByKeyword(keyword, resultsPerPage, page);
	}

	@GetMapping("/ai")
	public String testAI(@RequestBody String query) {
		return this.chatClient.prompt().user(query).call().content();
	}

	@PostMapping("/ai")
	public String testAIPost(@RequestBody String query) {
		return this.chatClient.prompt().user(query).call().content();
	}

}