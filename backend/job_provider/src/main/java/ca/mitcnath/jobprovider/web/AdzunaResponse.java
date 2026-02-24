package ca.mitcnath.jobprovider.web;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import ca.mitcnath.jobprovider.beans.Job;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdzunaResponse {

	private List<Job> results;
	
}
