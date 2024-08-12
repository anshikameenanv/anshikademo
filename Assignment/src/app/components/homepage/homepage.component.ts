import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, interval, map } from 'rxjs';
import { environment } from 'src/environment';
import { AuthService } from 'src/app/services/auth.service';
import { FilterrouteService } from 'src/app/services/filterroute.service';
import { DataService } from 'src/app/services/data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ViewportScroller } from '@angular/common';



@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  myForm!: FormGroup;
  dateRange!: FormGroup;
  selectedTabIndex: number = 1;
  showTravelerOptions: boolean = false;
  travelersCount: { adult: number; children: number; infantOnSeat: number, infantOnlap: number } = { adult: 1, children: 0, infantOnSeat: 0, infantOnlap: 0 };
  selectedMultiCity: boolean = false;
  childAges: any = [];
  infantAges = [{ value: '0', label: '0' }, { value: '1', label: '1' }];
  initialFormValues: any;
  submitTravelClicked: boolean = false;
  leavingFromOptions: { cityCode: string, cityName: string, name: string, countryCode: string, iataCode: string }[] = [];
  goingToOptions: { cityCode: string, cityName: string, name: string, countryCode: string, iataCode: string }[] = [];
  leavingFromOptions1: any[][] = [];
  goingToOptions1: any[][] = [];
  leavingFromSearchControls: FormControl[] = [];
  goingToSearchControls: FormControl[] = [];
  leavingFromControl = new FormControl();
  goingToFormControl = new FormControl();
  @ViewChild('departSelect') departSelect: MatSelect | undefined;
  isLoading: boolean = false;
  travelClasses = [{ value: 'ECONOMY', label: 'Economy' }, { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' }, { value: 'BUSINESS', label: 'Business Class' }, { value: 'FIRST', label: 'First Class' }];
  loading: boolean = false;
  flightMultiCitySearchDetail: any = [];
  minDate: Date;
  backgroundImage!: string;
  minReturnDate: any;
  multiCityFlightsError: boolean = false;
  totalTravelers: number = 0;
  currentDate$: Observable<Date> | undefined;
  showError: boolean = false;
  showError1: boolean = false;
  multiCityFlightLength: any = 0;
  latitude: any;
  longitude: any;
  neaarestAirportinfo: any;
  destinations: { name: string, imagePath: string, data: any }[] = [];
  imagePaths: string[] = [
    'assets/images/tdImg1.png',
    'assets/images/tdImg2.png',
    'assets/images/tdImg3.png',
    'assets/images/tdImg4.png',
    'assets/images/tdImg1.png',
    'assets/images/tdImg2.png'
  ];
  dummyData: any;
  destinationsData: any;
  dislayDestination: any = [];
  currentIndex: number = 0;
  isLoggedIn: boolean = false;
  previousValue: string = '';
  constructor(private fb: FormBuilder,
    private flightService: FlightsearchService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private viewportScroller: ViewportScroller,
    private filterRoute: FilterrouteService,
    private data: DataService,
    private snackBarService: SnackbarService) {
    this.minDate = new Date();
    this.minReturnDate =new Date();
    this.destinationsData = this.data.destinationsData;
    this.dummyData = this.data.dummyData;
  }
  focusDepartSelect() {
    if (this.departSelect) {
      this.departSelect.focus();
    }
  }

  topUsdestinationprev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 3;
      this.dislayDestination = this.destinations.slice(this.currentIndex, this.currentIndex + 3);
    }
  }
  topUsdestinationnext() {
    if (this.currentIndex + 3 < this.destinations.length) {
      this.currentIndex += 3;
      this.dislayDestination = this.destinations.slice(this.currentIndex, this.currentIndex + 3);
    }
  }
  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.flightService.getLocation().subscribe((response: any) => {

            this.latitude = response.latitude;
            this.longitude = response.longitude;
            this.getNearestAirport();
          });

        },
        (error) => {
          console.error('Error getting location', error);
          
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
    }

    this.getLocation();
    this.currentDate$ = interval(1000).pipe(
      map(() => new Date())
    );
    this.currentDate$.subscribe(currentDate => {
      if (currentDate.getHours() >= 4 && currentDate.getHours() < 12) {
        this.backgroundImage = 'url("../../assets/images/morning1.jpg")';
      } else if (currentDate.getHours() >= 12 && currentDate.getHours() < 19) {
        this.backgroundImage = 'url("../../assets/images/afternoon1.jpg")';
      } else {
        this.backgroundImage = 'url("../../assets/images/night2.1.jpg")';
      }
    });

    this.myForm = this.fb.group({
      leavingFrom: ['', Validators.required],
      goingTo: ['', Validators.required],
      directFlights: [false],
      dates: [new Date(), Validators.required],
      roundDatesDeparture: [new Date(), Validators.required],
      roundDatesGoingTo: [null, Validators.required],
      travelers: [1, Validators.required],
      multiCityFlights: this.fb.array([]),
      selectedTravelClass: ['ECONOMY']

    });
    this.dateRange = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.addMultiCityFlight();
    this.addMultiCityFlight();
    this.initialFormValues = this.myForm.value;
    this.myForm.get('roundDatesDeparture')?.valueChanges.subscribe(departureDate => {      
      if (departureDate) {
        this.updateMinReturnDate(departureDate);
      }
    });

    

    for (let i = 1; i <= 17; i++) {
      this.childAges.push({
        value: i.toString(),
        label: i.toString()
      });
    }

    this.getTopMostDestination();
    this.dislayDestination = this.destinations.slice(0, 3);
  }

  getNearestAirport(): void {
    this.isLoading = true;
    const locationCode = { latitude: this.latitude.toString(), longitude: this.longitude.toString() };
    this.flightService.NearestAirport(locationCode).subscribe(
      (response) => {
        if (response && response.data) {
          const airportInfo: any = {
            cityCode: response.data.cityCode,
            cityName: response.data.cityName,
            name: response.data.name,
            countryCode: response.data.countryCode,
            iataCode: response.data.iataCode
          };

          this.neaarestAirportinfo = airportInfo;
          this.myForm.get('leavingFrom')?.setValue(airportInfo);
          sessionStorage.setItem('NearestAirportCityName', response.data.cityName,);
          sessionStorage.setItem('airport', JSON.stringify(response.data))
          sessionStorage.setItem('NearestAirportCityiataCode', response.data.iataCode);
          this.leavingFromOptions = [];
          this.leavingFromOptions = [...this.leavingFromOptions, airportInfo];
          this.isLoading = false;
        }
        else {
          this.isLoading = false;
        }

      },
      (error) => {
        this.isLoading = false;
        console.error('Error:', error);
      }
    );
  }
  private updateMinReturnDate(departureDate: Date): void {
    25+46
    
    const returnDate = this.myForm.get('roundDatesGoingTo')?.value;
    this.minReturnDate = new Date(departureDate);

    // If the current return date is before the new departure date, update it
    if (returnDate && new Date(returnDate) < this.minReturnDate) {
      this.myForm.get('roundDatesGoingTo')?.setValue(this.minReturnDate);
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.totalTravelers = 0;
    this.multiCityFlightsError = false;
    this.travelersCount.adult = 1;
    this.travelersCount.children = 0;
    this.travelersCount.infantOnSeat = 0;
    this.travelersCount.infantOnlap = 0;
    this.showTravelerOptions = false;
    this.submitTravelClicked = true;
    this.selectedTabIndex = event.index;
    this.myForm.reset(this.initialFormValues);
    if (this.selectedTabIndex == 2) {
      if (this.neaarestAirportinfo !== undefined && this.neaarestAirportinfo !== null) {
        const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
        const formGroupAtIndex = multiCityFlightsArray.at(0) as FormGroup;
        formGroupAtIndex.get('leavingFrom')!.setValue(this.neaarestAirportinfo);
        this.leavingFromOptions1[0] = [this.neaarestAirportinfo];
      }
      this.selectedMultiCity = true;
    }
    else {
      this.selectedMultiCity = false;
    }
    if (this.neaarestAirportinfo !== undefined && this.neaarestAirportinfo !== null) {
      this.myForm.get('leavingFrom')?.setValue(this.neaarestAirportinfo);
    }

  }


  PassCoverageUrl() {
    const externalUrl = environment.externalUrl;
    window.open(externalUrl, "_blank");
  }

  BestPrice() {
    const externalUrl = '/bestprice';
    window.location.href = externalUrl;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  getAirportDropDown(cityName: any) {
    this.flightService.getAirportDetails(cityName).subscribe(
      (response: any) => {
        this.leavingFromOptions = response.data.map((airport: any) => ({
          cityCode: airport.cityCode,
          cityName: this.formatCityName(airport.cityName),
          name: this.formatCityName(airport.name),
          countryCode: airport.countryCode,
          iataCode: airport.iataCode
        }));
        this.previousValue = '';
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        console.error('Error fetching flight data:', error);
      }
    );
  }

  onInputChange(event: any, flightIndex: number) {
    if (event.target.value.length >= 3 && this.previousValue != event.target.value) {
      this.previousValue = event.target.value;
      this.loading = true;
      this.flightService.getAirportDetails(event.target.value).subscribe(
        (response: any) => {
          this.leavingFromOptions1[flightIndex] = response.data.map((airport: any) => ({
            cityCode: airport.cityCode,
            cityName: this.formatCityName(airport.cityName),
            name: this.formatCityName(airport.name),
            countryCode: airport.countryCode,
            iataCode: airport.iataCode,
          }));
          this.previousValue = '';
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          console.error('Error fetching flight data:', error);
        }
      );
    }

  }
  onLeavingFromSelectionChange(selectedOption: any, flightIndex: number) {
    const leavingFromOptions = this.leavingFromOptions1[flightIndex];
    const selectedOptionIndex = leavingFromOptions.indexOf(selectedOption);
    if (selectedOptionIndex !== -1) {
      leavingFromOptions.splice(0, leavingFromOptions.length, selectedOption);
    }
  }

  onGoingFromSelectionChange(selectedOption: any, flightIndex: number) {
    const goingToOptions = this.goingToOptions1[flightIndex];
    const selectedOptionIndex = goingToOptions.indexOf(selectedOption);
    if (selectedOptionIndex !== -1) {
      goingToOptions.splice(0, goingToOptions.length, selectedOption);
    }
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    const flightFormGroup = multiCityFlightsArray.at(flightIndex) as FormGroup;
    const goingToValue = flightFormGroup.get('goingTo')?.value;
    this.leavingFromOptions1[flightIndex + 1] = this.goingToOptions1[flightIndex]
    const formGroupAtIndex = multiCityFlightsArray.at(flightIndex + 1) as FormGroup;
    formGroupAtIndex.get('leavingFrom')!.setValue(goingToValue);

  }

  onInputChangeGoingTo(event: any, flightIndex: number) {
    if (event.target.value.length >= 3 && this.previousValue != event.target.value) {
      this.previousValue = event.target.value
      this.loading = true;
      this.flightService.getAirportDetails(event.target.value).subscribe(
        (response: any) => {
          this.goingToOptions1[flightIndex] = response.data.map((airport: any) => ({
            cityCode: airport.cityCode,
            cityName: this.formatCityName(airport.cityName),
            name: this.formatCityName(airport.name),
            countryCode: airport.countryCode,
            iataCode: airport.iataCode
          }));
          this.previousValue = '';
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          console.error('Error fetching flight data:', error);
        }
      );
    }
  }
  onSearchGoingTo() {
    this.goingToFormControl.valueChanges.subscribe(value => {
      if (value.length >= 3 && this.previousValue != value) {
        this.previousValue = value;
        this.loading = true;
        this.flightService.getAirportDetails(value).subscribe(
          (response: any) => {
            this.goingToOptions = response.data.map((airport: any) => ({
              cityCode: airport.cityCode,
              cityName: this.formatCityName(airport.cityName),
              name: this.formatCityName(airport.name),
              countryCode: airport.countryCode,
              iataCode: airport.iataCode
            }));
            this.previousValue = '';
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            console.error('Error fetching flight data:', error);
          }
        );
      }
    });
  }
  onSelectionGoingChange(event: MatSelectChange) {
    this.myForm.get('goingTo')?.setValue(event.value);
    this.goingToOptions = [];
    this.goingToOptions = [...this.goingToOptions, event.value];
  }
  onSelectionChange(event: MatSelectChange) {
    this.myForm.get('leavingFrom')?.setValue(event.value);
    this.leavingFromOptions = [];
    this.leavingFromOptions = [...this.leavingFromOptions, event.value];
  }
  onSearchInputChange() {

    this.leavingFromControl.valueChanges.subscribe(value => {

      if (value.length >= 3 && this.previousValue != value) {
        this.previousValue = value;
        this.loading = true;
        this.getAirportDropDown(value);
      }
    });
  }
  swapValues() {
    const temp = this.myForm.get('leavingFrom')?.value;
    this.myForm.get('leavingFrom')?.setValue(this.myForm.get('goingTo')?.value);
    this.myForm.get('goingTo')?.setValue(temp);
    [this.leavingFromOptions, this.goingToOptions] = [this.goingToOptions, this.leavingFromOptions];
  }
  updateTravelersControlValue() {
    const totalTraveler = this.travelersCount.adult + this.travelersCount.children + this.travelersCount.infantOnSeat + this.travelersCount.infantOnlap;
    this.totalTravelers = totalTraveler;
    this.myForm.get('travelers')?.setValue(totalTraveler);
  }
  increment(type: keyof typeof this.travelersCount) {
    if (this.getTotalTravelersCount() < 9) {
      this.travelersCount[type]++;
      this.updateTravelersControlValue();
      const totalInfants = this.travelersCount['infantOnlap'] + this.travelersCount['infantOnSeat'];
      if (this.travelersCount['adult'] < totalInfants) {
        this.showError1 = true;
        this.showError = false;
      }
      else {
        this.showError1 = false;
      }
      if (!this.showError1) {
        if (this.travelersCount['adult'] < this.travelersCount['infantOnlap']) {
          this.showError = true;
        }
        else {
          this.showError = false;
        }
      }

    }
  }

  decrement(type: keyof typeof this.travelersCount) {
    if (this.travelersCount[type] > 0) {
      this.travelersCount[type]--;
    }
    this.updateTravelersControlValue();
    const totalInfants = this.travelersCount['infantOnlap'] + this.travelersCount['infantOnSeat'];
    if (this.travelersCount['adult'] < totalInfants) {
      this.showError1 = true;
    }
    else {
      this.showError1 = false;
    }
    if (!this.showError1) {
      if (this.travelersCount['adult'] < this.travelersCount['infantOnlap']) {
        this.showError = true;
      }
      else {
        this.showError = false;
      }
    }
  }
  getTotalTravelersCount(): number {
    return this.travelersCount.adult + this.travelersCount.children + this.travelersCount.infantOnSeat + this.travelersCount.infantOnlap;
  }
  closeTravellerDropDown() {
    this.showError = false;
    this.showError1 = false;
    this.myForm.get('travelers')?.setValue(1);
    this.showTravelerOptions = false;
    this.travelersCount.adult = 1;
    this.travelersCount.children = 0;
    this.travelersCount.infantOnSeat = 0;
    this.travelersCount.infantOnlap = 0;
  }
  calculateDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const duration = arrival.getTime() - departure.getTime();

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
  toggleTravelerOptions() {
    this.showTravelerOptions = true;
    if (this.submitTravelClicked) {
      this.showTravelerOptions = false;
      this.submitTravelClicked = false;
    }
  }

  submitTravelInfo() {
    this.submitTravelClicked = true;
    if ((!this.showError && !this.showError1) || (this.showError && this.showError1)) {
      this.showTravelerOptions = false;
    }

  }

  selectOption() {
    this.showTravelerOptions = false;
  }

  get multiCityFlights() {
    return this.myForm.get('multiCityFlights') as FormArray;
  }
  swapMultiCity(flightIndex: any) {
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    const flightFormGroup = multiCityFlightsArray.at(flightIndex) as FormGroup;
    const leavingFromValue = flightFormGroup.get('leavingFrom')?.value;
    const goingToValue = flightFormGroup.get('goingTo')?.value;
    const tempValue = leavingFromValue;
    flightFormGroup.get('leavingFrom')?.setValue(goingToValue);
    flightFormGroup.get('goingTo')?.setValue(tempValue);
    const flightLeavingFromOptions = this.leavingFromOptions1[flightIndex];
    const flightGoingToOptions = this.goingToOptions1[flightIndex];
    [this.leavingFromOptions1[flightIndex], this.goingToOptions1[flightIndex]] = [flightGoingToOptions, flightLeavingFromOptions];

  }
  createMultiCityFlightFormGroup() {
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    const index = multiCityFlightsArray.value.length;
    if (multiCityFlightsArray.value.length < 1) {
      return this.fb.group({
        leavingFrom: new FormControl('', Validators.required),
        goingTo: new FormControl('', Validators.required),
        departDate: new FormControl(new Date(), Validators.required)
      });
    }
    else {
      const flightFormGroup = multiCityFlightsArray.at(index - 1) as FormGroup;
      const goingToValue = flightFormGroup.get('goingTo')?.value;
      this.leavingFromOptions1[index] = this.goingToOptions1[index - 1]
      return this.fb.group({

        leavingFrom: new FormControl(goingToValue, Validators.required),
        goingTo: new FormControl('', Validators.required),
        departDate: new FormControl(new Date(), Validators.required)
      });

    }

  }
  removeMultiCityFlight(index: number) {
    this.multiCityFlightLength = this.multiCityFlightLength - 1
    this.multiCityFlights.removeAt(index);
    this.leavingFromSearchControls.splice(index, 1);
    this.goingToSearchControls.splice(index, 1);
  }
  addMultiCityFlight() {
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    this.multiCityFlightLength = multiCityFlightsArray.value.length;

    if (multiCityFlightsArray.value.length < 5) {
      const newFlightGroup = this.createMultiCityFlightFormGroup();
      this.multiCityFlights.push(newFlightGroup);
      this.leavingFromSearchControls.push(new FormControl(''));
      this.goingToSearchControls.push(new FormControl(''));
      if (this.neaarestAirportinfo !== undefined && this.neaarestAirportinfo !== null) {
        const formGroupAtIndex = multiCityFlightsArray.at(0) as FormGroup;
        formGroupAtIndex.get('leavingFrom')!.setValue(this.neaarestAirportinfo);
        this.leavingFromOptions1[0] = [this.neaarestAirportinfo];
      }
    }
  }

  appenedNearestlocation() {
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    if (this.neaarestAirportinfo !== undefined && this.neaarestAirportinfo !== null) {
      const formGroupAtIndex = multiCityFlightsArray.at(0) as FormGroup;
      formGroupAtIndex.get('leavingFrom')!.setValue(this.neaarestAirportinfo);
      this.leavingFromOptions1[0] = [this.neaarestAirportinfo];
    }
  }

  SearchFlight() {
    this.flightMultiCitySearchDetail = [];
 
    const nonStop = this.myForm.get('directFlights')?.value;
    const formData = this.myForm.value;
    const temp = this.selectedTabIndex;

    if (formData.goingTo.cityCode === formData.leavingFrom.cityCode &&
      formData.goingTo.cityName === formData.leavingFrom.cityName &&
      formData.goingTo.countryCode === formData.leavingFrom.countryCode &&
      formData.goingTo.iataCode === formData.leavingFrom.iataCode &&
      formData.goingTo.name === formData.leavingFrom.name) {
        this.markAllControlsAsDirty(this.myForm);
      
        this.snackBarService.showSnackBar('Departure and Arrival cannot be same ', 'custom-snackbar-error');
      
    }
    else{

    
    if (this.checkValidity()) {

      this.isLoading = true;
      if (this.selectedMultiCity) {
        const flightDetails = this.getSearchFormData();
        const multiCityFlights = this.myForm.get('multiCityFlights')?.value;
        multiCityFlights.forEach((flight: { leavingFrom: any; goingTo: any; departDate: any; }, index: any) => {
          const originLocationCode = flight.leavingFrom.iataCode;
          const destinationLocationCode = flight.goingTo.iataCode;
          this.flightMultiCitySearchDetail.push({ origin: originLocationCode, destination: destinationLocationCode });
        });

        this.flightService.getFlightSearchData(flightDetails).subscribe(

          (response: any) => {
            if (response && response.data) {
              this.isLoading = false;
              const formData = this.myForm.value;
              let filteredOffers = response.data;
              if (nonStop) {
                sessionStorage.setItem('nonStop',nonStop);
                filteredOffers = this.filterOffersBySegmentLength(response.data);
                if (filteredOffers.length > 0) {
                  this.flightService.setSearchData(filteredOffers, formData, this.selectedTabIndex, this.flightMultiCitySearchDetail, this.travelersCount);
                  this.router.navigate(['/filter']);
                }
                else {
                  this.snackBarService.showSnackBar('No Non stop flight is available on this route', 'custom-snackbar-error');
                }

              }
              else {
                this.flightService.setSearchData(filteredOffers, formData, this.selectedTabIndex, this.flightMultiCitySearchDetail, this.travelersCount);
                // this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
                this.router.navigate(['/filter']);
              }

            }
            else {
              this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
              this.isLoading = false;
            }
          },
          (error: any) => {
            this.isLoading = false;
            this.selectedTabIndex = 2;
            this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
            console.error('Error fetching flight data:', error);
          }
        );
      }
      else {
        const flightDetails = this.getSearchFormData();
        this.flightService.getFlightSearchData(flightDetails).subscribe(
          (response: any) => {
            if (response && response.data) {
              this.isLoading = false;
              const formData = this.myForm.value;
              let filteredOffers = response.data;
              if (nonStop) {
                filteredOffers = this.filterOffersBySegmentLength(response.data);
                if (filteredOffers.length > 0) {
                  sessionStorage.setItem('nonStop',nonStop);
                  this.flightService.setSearchData(filteredOffers, formData, this.selectedTabIndex, this.flightMultiCitySearchDetail, this.travelersCount);
                  this.router.navigate(['/filter']);
                }
                else {
                  this.snackBarService.showSnackBar("No Non stop flight is available on this route", 'custom-snackbar-error');
                }
              }
              else {
                this.flightService.setSearchData(filteredOffers, formData, this.selectedTabIndex, this.flightMultiCitySearchDetail, this.travelersCount);
                this.router.navigate(['/filter']);
                // this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
                this.selectedTabIndex = temp;
              }
            }
            else {
              
              this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
              this.isLoading = false;
            }
          },
          (error: any) => {
            this.isLoading = false;
            this.selectedTabIndex = temp;
            this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
            console.error('Error fetching flight data:', error);
          }
        );
      }
    }
    else {
      this.markAllControlsAsDirty(this.myForm);
      this.multiCityFlightsError = true;
      this.snackBarService.showSnackBar('Please fill data in requried feilds for search', 'custom-snackbar-error');

    }
  }
  }

  // markAllControlsAsDirty(formGroup: FormGroup): void {
  //   Object.keys(formGroup.controls).forEach(controlName => {
  //     const control = formGroup.get(controlName);
  //     control?.markAsDirty();
  //     if (control instanceof FormGroup) {
  //       this.markAllControlsAsDirty(control);
  //     }
  //   });
  // }
  markAllControlsAsDirty(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      control?.markAsDirty();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsAsDirty(control);
      }
    });
  }


  // Function to check validity of oneway and roundtrip flights

  checkValidity(): boolean {
    if (this.selectedTabIndex === 0) {

      return this.checkControlValidity('leavingFrom') &&
        this.checkControlValidity('goingTo') &&
        this.checkControlValidity('dates') &&
        this.checkControlValidity('travelers');
    } else if (this.selectedTabIndex === 1) {

      return this.checkControlValidity('leavingFrom') &&
      this.checkControlValidity('roundDatesGoingTo') &&
      this.checkControlValidity('roundDatesDeparture') &&
        this.checkControlValidity('goingTo') &&
        this.checkControlValidity('travelers')

    } else {
      return this.checkControlValidity('travelers') &&
        this.checkMultiCityFlightsValidity();
    }
  }

  checkControlValidity(controlName: string): boolean {
    const control = this.myForm.get(controlName);
    return control ? control.valid : false;
  }
  // Function to check validity of multi-city flights

  checkMultiCityFlightsValidity(): boolean {
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    for (let i = 0; i < multiCityFlightsArray.length; i++) {
      const multiCityFlightGroup = multiCityFlightsArray.at(i) as FormGroup;
      if (!multiCityFlightGroup.valid) {
        return false;
      }
    }
    return true;
  }



  getSearchFormData(): any {
    let travelersArray: any[] = [];
    let totalIterations = 0;
    Object.entries(this.travelersCount).forEach(([type, count]) => {
      if (count > 0) {
        let updatedType = type;
        if (type != "infantOnlap") {
          if (type === "children") {
            updatedType = "CHILD";
          } else if (type === "infantOnSeat") {
            updatedType = "SEATED_INFANT";
          }
          else {
            updatedType = "ADULT";
          }

          for (let i = 0; i < count; i++) {
            totalIterations++;
            travelersArray.push({
              id: totalIterations,
              travelerType: updatedType
            });
          }
        }
      }
    });

    for (let i = 0; i < this.travelersCount.infantOnlap; i++) {
      totalIterations++;
      const associatedId = travelersArray[i].id;
      travelersArray.push({
        id: totalIterations,
        travelerType: "HELD_INFANT",
        associatedAdultId: associatedId
      })
    }
    const searchData = {
      currencyCode: "USD",
      originDestinations: [
        {
          id: "1",
          originLocationCode: this.myForm.get('leavingFrom')?.value.iataCode,
          destinationLocationCode: this.myForm.get('goingTo')?.value.iataCode,
          departureDateTimeRange: {
            date: "",
            time: ""
          }
        }
      ],
      travelers: travelersArray,
      sources: [
        "GDS"
      ],
      searchCriteria: {
        maxFlightOffers: 50,
        nonStop: this.myForm.get('directFlights')?.value,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: this.myForm.get('selectedTravelClass')?.value,
              coverage: "MOST_SEGMENTS",
              originDestinationIds: [
                "1"
              ]
            }
          ]
        }
      }
    }
    if (this.selectedTabIndex == 1) {
      searchData.originDestinations[0].departureDateTimeRange.date = this.formatDate(this.myForm.get('roundDatesDeparture')?.value);
      searchData.originDestinations[0].departureDateTimeRange.time = this.formattime(this.myForm.get('roundDatesDeparture')?.value);
      return searchData;
    }
    else if (this.selectedTabIndex == 2) {
      const multiCityFlights = this.myForm.get('multiCityFlights')?.value;
      const firstFlight = multiCityFlights[0];
      const originLocationCode = firstFlight.leavingFrom.iataCode;
      const destinationLocationCode = firstFlight.goingTo.iataCode;
      const departureDateTimeRange = this.formatDate(firstFlight.departDate);
      searchData.originDestinations[0].originLocationCode = originLocationCode;
      searchData.originDestinations[0].destinationLocationCode = destinationLocationCode;
      searchData.originDestinations[0].departureDateTimeRange.date = departureDateTimeRange;
      searchData.originDestinations[0].departureDateTimeRange.time = this.formattime(firstFlight.departDate);
      return searchData;
    }
    else {
      searchData.originDestinations[0].departureDateTimeRange.date = this.formatDate(this.myForm.get('dates')?.value);
      searchData.originDestinations[0].departureDateTimeRange.time = this.formattime(this.myForm.get('dates')?.value);
      return searchData;
    }
  }

  getTopMostDestination() {
    let country = ['New York', 'Las Vegas', 'Chicago', 'Los Angeles', 'Miami', 'Orlando'];
    for (let index = 0; index < country.length; index++) {
      this.destinations.push({ name: country[index], imagePath: this.imagePaths[index], data: this.destinationsData[index] });
      this.dislayDestination = this.destinations.slice(0, 3);
    }
  }


  handleDestinationSelection(destination: any) 
  {
    this.isLoading = true;
    const selectedTabIndex = 0;
    const flightMultiCitySearchDetail: any = [];
    let origin: any;
    let leavingFrom: any;
    origin = sessionStorage.getItem('airport');
    const airport = JSON.parse(origin);


    if (airport && airport.iataCode != 'IDR') {
      leavingFrom = {
        cityCode: airport.cityCode,
        cityName: this.formatCityName(airport.cityName),
        name: this.formatCityName(airport.name),
        countryCode: airport.countryCode,
        iataCode: airport.iataCode
      }
    } else {

      leavingFrom = this.dummyData;
    }
    const formData = this.filterRoute.getSearchFormData(destination.data.iataCode, leavingFrom.iataCode);
    const todayISO = new Date();
    const myform = {
      leavingFrom: leavingFrom,
      goingTo: destination.data,
      directFlights: false,
      dates: todayISO,
      roundDatesDeparture: todayISO,
      roundDatesGoingTo: todayISO,
      travelers: 1,
      multiCityFlights: [
        {
          leavingFrom: "",
          goingTo: "",
          departDate: todayISO
        },
        {
          leavingFrom: "",
          goingTo: "",
          departDate: todayISO
        }
      ],
      selectedTravelClass: "ECONOMY"
    };



    this.flightService.getFlightSearchData(formData).subscribe(
      (response: any) => {
        if (response && response.data) {
          let filteredOffers = response.data;
          this.isLoading = false;

          this.flightService.setSearchData(filteredOffers, myform, selectedTabIndex, flightMultiCitySearchDetail, this.travelersCount);
          this.viewportScroller.scrollToPosition([0, 0]);
          // this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
          this.router.navigate(['/filter']);
        }
        else {
    
          this.isLoading = false; 
          this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
        console.error('Error fetching flight data:', error);
      }
    );

  }
  formatCityName(cityName: string): string {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  }
  formatDate(selectedDate: any) {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  formattime(selectedDate: any) {
    const date = new Date(selectedDate);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const formattedtime = `${hours}:${minutes}:${seconds}`;
    return formattedtime;

  }
  filterOffersBySegmentLength(data: any[]): any[] {
    let filterData: any = [];

    for (const offer of data) {
      if (offer.itineraries && Array.isArray(offer.itineraries)) {
        for (const itinerary of offer.itineraries) {
          if (itinerary.segments && Array.isArray(itinerary.segments)) {
            if (itinerary.segments.length > 1) {
              break;
            }
            else {
              filterData.push(offer);
            }
          }
        }
      }
    }
    return filterData;
  }


  panelOpenState = false;
}
const formatDateToISO = (date: Date) => {
  return date.toISOString();
};