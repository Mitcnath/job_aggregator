package ca.mitcnath.jobprovider.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Location {

	@JsonProperty("display_name")
	private String displayName;

	@JsonProperty("area")
	private String[] area;
}
