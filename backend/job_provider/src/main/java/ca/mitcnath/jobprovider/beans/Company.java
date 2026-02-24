package ca.mitcnath.jobprovider.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Company {
	
	@JsonProperty("display_name")
	private String displayName;
	
}
