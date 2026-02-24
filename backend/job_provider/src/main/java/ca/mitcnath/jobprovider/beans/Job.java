package ca.mitcnath.jobprovider.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Job {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@JsonProperty("title")
	private String title;

	private Company company;

	private Location location;

	@JsonProperty("description")
	private String description;

	@JsonProperty("created")
	private String dateCreated;

	@JsonProperty("redirect_url")
	private String redirectUrl;

	@JsonProperty("salary_min")
	private Double salaryMin;
	
	@JsonProperty("salary_max")
	private Double salaryMax;
	
	@JsonProperty("contract_time")
	private String contractTime;
}
