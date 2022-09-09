import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { IJobs } from "../model/job-model";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataFetchService {
  jobUrl = "https://api.crossref.org/works?filter=has-full-text:true&mailto=GroovyBib@example.org";
  jobDetails: IJobs[];
  sources: string[] = [];
  private loading = new BehaviorSubject(false);
  private dataFetching = new BehaviorSubject(true);
  private errorLoading = new BehaviorSubject(false);
  currentState = this.loading.asObservable();
  currentJobFetch = this.dataFetching.asObservable();
  currentErrorState = this.errorLoading.asObservable();

  // Since the locations provided in the JSON were too random and contained long strings, have hardcoded common locations.
  locations: string[] = [
    "North America",
    "Latin America",
    "Europe",
    "Asia Pacific",
    "Africa",
    "West Africa",
    "Sub-Sahara",
    "Middle East",
    
  ];

  experiences: string[] = [
    "Freshers",
    "0-1 Years",
    "2-3 Years",
    "4-5 Years",
    "8+ Years"
  ];

  constructor(private http: HttpClient) {
    this.getJobDetails().subscribe(
      jobs => {
        this.jobDetails = jobs.data;
        // console.log("Check jobs", this.jobDetails);
        this.jobDetails.forEach(job => {
          job = this.changeExperience(job);
        });
        this.changeFetchState(false);

        this.getUniqueSources();
        // console.log("Sources", this.sources);
      },
      err => {
        this.changeErrorState(true);
      }
    );

    // this.jobDetails = this.dummyData;
  }

  changeExperience(job: IJobs): IJobs {
    if (!job.experience || job.experience.split("-")[0].charAt(0) === "0") {
      job.experience = "Freshers";
    }
    return job;
  }

  getJobDetails(): Observable<any> {
    return this.http.get(this.jobUrl);
  }

  getUniqueSources() {
    this.jobDetails.forEach(job => {
      if (!this.sources.includes(job.source)) {
        this.sources.push(job.source);
      }
    });
  }

  changeLoadState(state: boolean) {
    this.loading.next(state);
  }

  changeFetchState(state: boolean) {
    this.dataFetching.next(state);
  }

  changeErrorState(state: boolean) {
    this.errorLoading.next(state);
  }

  getJobs() {
    return this.jobDetails;
  }
}
