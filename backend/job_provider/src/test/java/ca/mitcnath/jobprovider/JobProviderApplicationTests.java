package ca.mitcnath.jobprovider;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import ca.mitcnath.jobprovider.services.JobService;

@SpringBootTest
class JobProviderApplicationTests {

	@Autowired
	private JobService jobService;
	
	@Test
	void contextLoads() throws JsonMappingException, JsonProcessingException {
		System.out.println("testing rest api");
		System.out.println(jobService.getJobs());
	}

}