import { Component, HostListener, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { SessionrefreshService } from 'src/app/services/sessionrefresh.service';
import { SelectFlightComponent } from '../select-flight/select-flight.component';
import { SelectSeatComponent } from '../select-seat/select-seat.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AirlineService } from 'src/app/services/airline.service';


@Component({
  selector: 'app-filter-flight-page',
  templateUrl: './filter-flight-page.component.html',
  styleUrls: ['./filter-flight-page.component.scss']
})
export class FilterFlightPageComponent {
  
  myForm!: FormGroup;
  dateRange!: FormGroup;
  selectedTabIndex: number = 0;
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
  flightResults: any[] = [];
  sortOptions = [{ value: 'priceLowest', label: 'Price (Lowest)' }, { value: 'priceHighest', label: 'Price (Highest)' }, { value: 'durationShortest', label: 'Duration (Shortest)' }, { value: 'durationLongest', label: 'Duration (Longest)' }, { value: 'departureEarliest', label: 'Departure (Earliest)' }, { value: 'departureLatest', label: 'Departure (Latest)' }, { value: 'arrivalEarliest', label: 'Arrival (Earliest)' }, { value: 'arrivalLatest', label: 'Arrival (Latest)' }];
  isLoading: boolean = false;
  travelClasses = [{ value: 'ECONOMY', label: 'Economy' }, { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' }, { value: 'BUSINESS', label: 'Business Class' }, { value: 'FIRST', label: 'First Class' }];
  loading: boolean = false;
  flightData: any[] = [];
  datesRangeResult: any = [];
  SelectedFilterArray: any = [];
  FlightResult: any = [];
  flightMultiCitySearchDetail: any = [];
  FlightMultiCity: any = [];
  MulticityFlightResult: any = [];
  centerBoxIndex: number = 1;
  minDate: Date;
  minReturnDate: any;
  selectedTripType: string = '';
  multiCityFlightsError: boolean = false;
  totalTravelers: number = 1;
  searchData: any;
  StopsFilter: any = [];
  arrivalFilter: any = [];
  departureFilter: any = [];
  airlineFilter: any = [];
  selectedFilterArray: any = [];
  flightOneWayData: any[] = [];
  FlightResultOneWay: any[] = [];
  flightDataMultiCity: any[] = [];
  MultiCityFlightData: any[] = [];
  showError: boolean = false;
  showError1: boolean = false;
  selectedFlight: any = 0;
  numFlightsShown: any = 0;
  activeIndex: number = 0;
  flightSelected: any = [];
  selectedFlightsMultiCity: { index: number, flightData: any }[] = [];
  selectedFlightOffer: any = [];
  showTicketSummarry: boolean = false;
  flightSelectedArray: any = [];
  selectedSeats: any[][] = [];
  showSeatSelection: boolean = false;
  displayedDates: any[] = []; // Array to store the currently displayed dates
  currentIndex = 0; // Index to keep track of the current position in datesRangeResult
  selectedDateIndex: number = -1;
  showFilterDropDown: boolean = false;
  @ViewChild('sortSelect') sortSelect!: MatSelect;
  previousValue: string = '';
  isResolutionValid = true; // Initial value
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isResolutionValid = window.innerWidth >= 768;

  }

  constructor(private fb: FormBuilder, private airLineService :AirlineService,
    private snackBarService: SnackbarService,private flightService: FlightsearchService, private inactivityService: SessionrefreshService, private snackBar: MatSnackBar, public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {

    this.minDate = new Date();
    this.myForm = this.fb.group({
      leavingFrom: ['', Validators.required],
      goingTo: ['', Validators.required],
      dates: [null, Validators.required],
      roundDatesDeparture: [null, Validators.required],
      roundDatesGoingTo: [null, Validators.required],
      travelers: [1, Validators.required],
      multiCityFlights: this.fb.array([]),
      selectedTravelClass: ['ECONOMY']
    });
    this.initialFormValues = this.myForm.value;
    for (let i = 1; i <= 17; i++) {
      this.childAges.push({
        value: i.toString(),
        label: i.toString()
      });
    }
  }
  showFilter() {
    this.showFilterDropDown = !this.showFilterDropDown

  }
  patchtravellerValue(data: any) {
    this.travelersCount = {
      adult: data.adult,
      children: data.children,
      infantOnSeat: data.infantOnSeat,
      infantOnlap: data.infantOnlap
    };
  }

  handleTripClick(index: any) {
    if (this.selectedTripType == 'roundTrip') {
      this.activeIndex = index;
      const indexAsString = index.toString();
      const storedData = sessionStorage.getItem(indexAsString);
      if (storedData) {

        this.flightData = JSON.parse(storedData);
        this.FlightResult = JSON.parse(storedData);
      } else {
        this.SearchFlight(this.activeIndex);
      }
    }
    else 
    {
      this.activeIndex = index;
      this.selectedFlight = index;
      const indexAsString = index.toString();
      const storedData = sessionStorage.getItem(indexAsString);
      if (storedData) {
        this.MultiCityFlightData = JSON.parse(storedData);
        this.flightDataMultiCity = JSON.parse(storedData);
      } else {
        this.SearchFlight(this.activeIndex);
      }
    }

  }
  ngOnInit(): void {
    this.inactivityService.inactivityReached.subscribe(() => {
      if (confirm('Your session has expired due to inactivity. Do you want to refresh the page?')) {
        this.SearchFlight();
      }
    });

    this.inactivityService.startTimer();
    this.myForm.get('roundDatesDeparture')?.valueChanges.subscribe(departureDate => {
      if (departureDate) {
        this.updateMinReturnDate(departureDate);
      }
    });

    this.flightService.searchInput$.subscribe(data => {
      this.searchData = data;

    });

    if (this.searchData != null) {
      this.flightService.tabIndex$.subscribe(data => {
        this.selectedTabIndex = data;
        if (data == 0) {
          this.selectedTripType = 'oneway'
          this.myForm.get('leavingFrom')?.setValue(this.searchData.leavingFrom);
          this.myForm.get('goingTo')?.setValue(this.searchData.goingTo);
          this.leavingFromOptions.push(this.searchData.leavingFrom);
          this.goingToOptions.push(this.searchData.goingTo);
          this.updateDates(this.searchData.dates);
          this.myForm.patchValue(this.searchData);
          this.myForm.get('roundDatesDeparture')?.setValue(this.searchData.dates);
          this.flightService.searchData$.subscribe(data => {
            this.flightOneWayData = data;
            this.FlightResultOneWay = data;
          });
          sessionStorage.setItem('0', JSON.stringify(this.FlightResultOneWay));
          this.getFilterFunctionWithItinerary();
          this.addMultiCityFlight();
          this.addMultiCityFlight();
        } 
        else if (data == 1) {
          this.selectedTripType = 'roundTrip'
          this.myForm.get('leavingFrom')?.setValue(this.searchData.leavingFrom);
          this.myForm.get('goingTo')?.setValue(this.searchData.goingTo);
          this.leavingFromOptions.push(this.searchData.leavingFrom);
          this.goingToOptions.push(this.searchData.goingTo);          
          this.myForm.get('roundDatesDeparture')?.setValue(this.searchData.roundDatesDeparture);
          this.updateDates(this.searchData.roundDatesDeparture);          
          this.myForm.patchValue(this.searchData);
          this.flightService.searchData$.subscribe(data => {
            this.flightData = data;
            this.FlightResult = data;
          });
          sessionStorage.setItem('0', JSON.stringify(this.FlightResult));

          this.getFilterFunctionWithItinerary();
          this.addMultiCityFlight();
          this.addMultiCityFlight();
        }
        else {
          this.selectedTripType = 'multiCity';
          const arrayControl = this.searchData.multiCityFlights;
          for (var i = 0; i < arrayControl.length; i++) {
            this.addMultiCityFlight();
          }
          this.myForm.get('multiCityFlights')?.patchValue(arrayControl);
          arrayControl.forEach((flight: { leavingFrom: any; goingTo: any; }, index: number) => {
            this.leavingFromOptions1[index] = [flight.leavingFrom];
            this.goingToOptions1[index] = [flight.goingTo];
          });


          this.flightService.searchData$.subscribe(data => {
            this.MultiCityFlightData = data;
            this.MultiCityFlightData = data;
            this.flightDataMultiCity = data;
            this.getFilterFunctionWithItinerary();
            sessionStorage.setItem('0', JSON.stringify(this.MultiCityFlightData));
          });
          this.flightService.multiData$.subscribe(data => {

            this.flightMultiCitySearchDetail = data;
          });

        }
      });
    }
    this.flightService.travelData$.subscribe(data => {
      this.patchtravellerValue(data);
      this.updateTravelersControlValue();
    });
    this.showMoreFlights();

    this.myForm.get('roundDatesDeparture')?.valueChanges.subscribe(departureDate => {
      this.minReturnDate = departureDate;
      this.myForm.get('roundDatesGoingTo')?.setValue(departureDate);
    });
  }
  private updateMinReturnDate(departureDate: Date): void {
    const returnDate = this.myForm.get('roundDatesGoingTo')?.value;
    this.minReturnDate = new Date(departureDate);

    // If the current return date is before the new departure date, update it
    if (returnDate && new Date(returnDate) < this.minReturnDate) {
      this.myForm.get('roundDatesGoingTo')?.setValue(this.minReturnDate);
    }
  }
  showLessFlights() {
    this.numFlightsShown = 6;
  }
  getOptionValue(option: any) {
    if (option.typeId === 'DepartureTime') {
      const existingDepartureIndex = this.SelectedFilterArray.findIndex((option: any) => option.typeId === 'DepartureTime');
      if (existingDepartureIndex !== -1) {
        this.SelectedFilterArray[existingDepartureIndex].checked = false;
        // Remove existing departure time object
        this.SelectedFilterArray.splice(existingDepartureIndex, 1);
      }
    }
    if (option.typeId === 'arrivalTime') {
      const existingDepartureIndex = this.SelectedFilterArray.findIndex((option: any) => option.typeId === 'arrivalTime');
      if (existingDepartureIndex !== -1) {
        this.SelectedFilterArray[existingDepartureIndex].checked = false;
        // Remove existing departure time object
        this.SelectedFilterArray.splice(existingDepartureIndex, 1);
      }
    }
    if (!option.checked) {
      option.checked = true;

      if (!this.SelectedFilterArray.find((item: any) => item === option)) {
        this.SelectedFilterArray.push(option);

      }
    } else {
      option.checked = false;
      const index = this.SelectedFilterArray.findIndex((item: any) => item === option);
      if (index !== -1) {
        this.SelectedFilterArray.splice(index, 1);
      }

    }
    this.applyFilters();
  }

  updateDates(Input: any) {
    this.centerBoxIndex = -1;
    this.selectedDateIndex = -1;
    var selectedDate;

    if (Input.value) {
      selectedDate = new Date(Input.value);
    }
    else {
      selectedDate = new Date(Input);
    }

    if (selectedDate) {
      this.datesRangeResult = [];
      const daysToShow = 100; // Number of days to show

      for (let i = 0; i < daysToShow; i++) {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() + i);
        const dateObject = {
          completeDate: date,
          date: date.getDate(),
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          month: date.toLocaleDateString('en-US', { month: 'short' })
        };
        this.datesRangeResult.push(dateObject);
        this.displayedDates = this.datesRangeResult.slice(0, 10);
        this.selectedDateIndex = this.datesRangeResult[0];
        this.centerBoxIndex = 0;

      }
    } 
  }
  showPreviousDates() {

    if (this.currentIndex > 0) {
      this.currentIndex -= 10;
      this.displayedDates = this.datesRangeResult.slice(this.currentIndex, this.currentIndex + 10);
      const index = this.findIndexByDateObject(this.displayedDates, this.selectedDateIndex);
      this.centerBoxIndex = index;
    }
  }
  findIndexByDateObject(dateArray: any[], targetDateObject: any): number {
    for (let i = 0; i < dateArray.length; i++) {
      if (dateArray[i] === targetDateObject) {
        return i; // Return the index if the object matches
      }
    }

    return -1; // Return -1 if no match is found
  }
  showNextDates() {

    if (this.currentIndex + 10 < this.datesRangeResult.length) {
      this.currentIndex += 10;
      this.centerBoxIndex = -1;
      this.displayedDates = this.datesRangeResult.slice(this.currentIndex, this.currentIndex + 10);
      const index = this.findIndexByDateObject(this.displayedDates, this.selectedDateIndex);
      this.centerBoxIndex = index;
    }
  }

  refreshdata() {
    this.StopsFilter = [];
    this.airlineFilter = [];
    this.departureFilter = [];
    this.arrivalFilter = [];
    this.sortSelect.writeValue(null);

  }
  onSelectTripType(event: any) {

    this.flightSelected = [];
    if (event.value == 'roundTrip') {

      this.flightData = [];
      this.refreshdata();
    }
    else {
      this.flightData = [];
      this.refreshdata();
    }


  }
  //Function for getting data for dropdown and swapping

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
  // onGoingFromSelectionChange(selectedOption: any, flightIndex: number) {
  //   const goingToOptions = this.goingToOptions1[flightIndex];
  //   const selectedOptionIndex = goingToOptions.indexOf(selectedOption);
  //   if (selectedOptionIndex !== -1) {
  //     goingToOptions.splice(0, goingToOptions.length, selectedOption);
  //   }
  // }


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
    formGroupAtIndex.get('leavingFrom')!.setValue(goingToValue)
  }

  onInputChangeGoingTo(event: any, flightIndex: number) {
    if (event.target.value.length >= 3 && this.previousValue != event.target.value) {
      this.previousValue = event.target.value;
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
          }
        );
      }
    });
  }
  onSelectionGoingChange(event: MatSelectChange) {
    this.goingToOptions = [];
    this.goingToOptions = [...this.goingToOptions, event.value];
  }
  onSelectionChange(event: MatSelectChange) {
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
  //code for traveller dropdown
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

    this.totalTravelers = 1;
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
  getCityName(iataCode: string, flightData: any): string | undefined {
    const allCities = [...flightData.departureCitys, ...flightData.arrivalCitys];
    const city = allCities.find(city => city.iataCode === iataCode);
    return city ? city.cityName : undefined;
  }

  selectOption() {
    this.showTravelerOptions = false;
  }

  // multicity functionality code
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
    if (multiCityFlightsArray.value < 1) {
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
    this.multiCityFlights.removeAt(index);
    this.leavingFromSearchControls.splice(index, 1);
    this.goingToSearchControls.splice(index, 1);
  }
  addMultiCityFlight() {
    const multiCityFlightsArray = this.myForm.get('multiCityFlights') as FormArray;
    const index = multiCityFlightsArray.value.length;
    if (multiCityFlightsArray.value.length < 5) {
      const newFlightGroup = this.createMultiCityFlightFormGroup();
      this.multiCityFlights.push(newFlightGroup);
      this.leavingFromSearchControls.push(new FormControl(''));
      this.goingToSearchControls.push(new FormControl(''));
    }


  }


  //Function to find the first matching flight based on provided arrival IATA code and destination code
  findMatchingFlight(responseData: any, arrivalIataCode: any, destinationCode: any) {
    const matchingFlights: any = [];
    for (const flights of responseData) {
      for (const flightData of flights) {
        for (const flight of flightData) {
          if (flight.arrival && flight.arrival.iataCode === destinationCode ||
            flight.departure && flight.departure.iataCode === arrivalIataCode) {
            matchingFlights.push(flight);
          }
        }
      }
    }
    return matchingFlights;
  }
  clearFilter() {
    debugger
    this.SelectedFilterArray = [];
    this.flightOneWayData = this.FlightResultOneWay;
    this.flightData = this.FlightResult;
    this.flightDataMultiCity = this.MultiCityFlightData;
    this.StopsFilter.forEach((filter: any) => {
      filter.checked = true;
    });
    this.airlineFilter.forEach((filter: any) => {
      filter.checked = true;
    });
    this.arrivalFilter.forEach((filter: any) => {
      filter.checked = true;
    });
    this.departureFilter.forEach((filter: any) => {
      filter.checked = true;
    });
    const radioButton = document.getElementsByName('departure-time') as NodeListOf<HTMLInputElement>;
    radioButton.forEach(rb => rb.checked = false);
    const radioButtons = document.getElementsByName('Arrival-Time') as NodeListOf<HTMLInputElement>;
    radioButtons.forEach(rb => rb.checked = false);
  }

  SearchFlight(index?: any) {
    if (this.selectedTripType === 'roundTrip' && this.myForm.get('roundDatesGoingTo')?.invalid) {
      this.myForm.get('roundDatesGoingTo')?.markAsTouched(); 
      this.snackBarService.showSnackBar('Please select a return date for the round trip.', 'custom-snackbar-error');
      this.isLoading = false;
      return;
    }
    this.numFlightsShown = 6;
    this.flightOneWayData = [];
    this.refreshdata();
    this.flightData = [];
    this.flightMultiCitySearchDetail = [];
    this.SelectedFilterArray = [];
    const temp = this.selectedTabIndex;
    if (index !== undefined && index !== null) {
      this.selectedFlight = index;
      this.activeIndex = index;
    }
    else {
      index = 0;
      this.flightSelected = [];
      this.activeIndex = 0;
      this.selectedSeats = [];
      this.selectedFlight = 0;
      this.selectedFlightsMultiCity = [];
      this.selectedFlightOffer = [];
      sessionStorage.clear();
    }
    this.isLoading = true;
    if (this.selectedTripType == 'multiCity') {
      const flightDetails = this.getSearchFormData(index);
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
            const nonStop = sessionStorage.getItem('nonStop');
            if(nonStop){
              let filteredOffers=[];
              filteredOffers = this.filterOffersBySegmentLength(response.data);
              if (filteredOffers.length > 0) {
                this.flightDataMultiCity = [...filteredOffers];
                this.MultiCityFlightData =[...filteredOffers];
                const indexAsString = this.activeIndex.toString();
                sessionStorage.setItem(indexAsString, JSON.stringify(this.flightDataMultiCity));
              }else{
                this.flightDataMultiCity = response.data;
                this.MultiCityFlightData = response.data;
                const indexAsString = this.activeIndex.toString();
                sessionStorage.setItem(indexAsString, JSON.stringify(this.flightDataMultiCity));
              }
 
            }else{
              this.flightDataMultiCity = response.data;
              this.MultiCityFlightData = response.data;
              const indexAsString = this.activeIndex.toString();
              sessionStorage.setItem(indexAsString, JSON.stringify(this.flightDataMultiCity));
            }
        
        
            // this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
            this.getFilterFunctionWithItinerary();
          }
          else {
            this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
            this.isLoading = false;
          }
        },
        (error: any) => {
          this.isLoading = false;
          this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
          this.selectedTabIndex = 2;
        }
      );
    }
    else {
      const flightDetails = this.getSearchFormData(index);
      this.flightService.getFlightSearchData(flightDetails).subscribe(
        (response: any) => {
          if (response && response.data) {
            if (this.selectedTripType != 'roundTrip') {
              this.flightOneWayData = response.data
              this.FlightResultOneWay = response.data

            } else {

              const nonStop = sessionStorage.getItem('nonStop');
              if(nonStop){
                let filteredOffers=[];
                filteredOffers = this.filterOffersBySegmentLength(response.data);
            
       
                if (filteredOffers.length > 0) {
                  this.FlightResult=[...filteredOffers];
                  this.flightData=[...filteredOffers];
                  const indexAsString = this.activeIndex.toString();
                  sessionStorage.setItem(indexAsString, JSON.stringify(this.flightData));
                }
                else {
                  this.flightData = response.data;
                  this.FlightResult = response.data;
                  const indexAsString = this.activeIndex.toString();
                  sessionStorage.setItem(indexAsString, JSON.stringify(this.flightData));
                  this.snackBarService.showSnackBar('No Non stop flight is available on this route', 'custom-snackbar-error');
                }

              }else{
                this.flightData = response.data;
                this.FlightResult = response.data;
                const indexAsString = this.activeIndex.toString();
                sessionStorage.setItem(indexAsString, JSON.stringify(this.flightData));
              }
            }

            this.getFilterFunctionWithItinerary();
            // this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
            this.isLoading = false;
            this.selectedTabIndex = temp;
          }
          else {
            this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
            this.isLoading = false;
          }

        },
        (error: any) => {
          this.isLoading = false;
          this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
          this.selectedTabIndex = temp;

        }
      );
    }

  }

  markAllControlsAsDirty(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      control?.markAsDirty();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsAsDirty(control);
      }
    });
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


  // Function to check validity of oneway and roundtrip flights

  checkValidity(): boolean {
    if (this.selectedTabIndex === 0) {
      return this.checkControlValidity('leavingFrom') &&
        this.checkControlValidity('goingTo') &&
        this.checkControlValidity('dates') &&
        this.checkControlValidity('travelers');
    } else if (this.selectedTabIndex === 1) {
      return this.checkControlValidity('leavingFrom') &&
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

  //Function For getting serach input
  showMoreFlights() {
    if (!this.numFlightsShown) {
      this.numFlightsShown = 6;
    } else {
      this.numFlightsShown += 6;
    }
  }
  getSearchFormData(index?: any): any {
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
        nonStop: false,
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
    if (this.selectedTripType == 'roundTrip') {
      if (index == 1) {
        searchData.originDestinations[0].originLocationCode = this.myForm.get('goingTo')?.value.iataCode,
          searchData.originDestinations[0].destinationLocationCode = this.myForm.get('leavingFrom')?.value.iataCode,
          searchData.originDestinations[0].departureDateTimeRange.date = this.formatDate(this.myForm.get('roundDatesGoingTo')?.value)
        searchData.originDestinations[0].departureDateTimeRange.time = this.formattime(this.myForm.get('roundDatesGoingTo')?.value)
        return searchData;
      }
      else {
        searchData.originDestinations[0].originLocationCode = this.myForm.get('leavingFrom')?.value.iataCode,
          searchData.originDestinations[0].destinationLocationCode = this.myForm.get('goingTo')?.value.iataCode,
          searchData.originDestinations[0].departureDateTimeRange.date = this.formatDate(this.myForm.get('roundDatesDeparture')?.value)
        searchData.originDestinations[0].departureDateTimeRange.time = this.formattime(this.myForm.get('roundDatesDeparture')?.value)
        return searchData;
      }

    }
    else if (this.selectedTripType == 'multiCity') {
      const multiCityFlights = this.myForm.get('multiCityFlights')?.value;
      const firstFlight = multiCityFlights[index];
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
      searchData.originDestinations[0].originLocationCode = this.myForm.get('leavingFrom')?.value.iataCode,
        searchData.originDestinations[0].destinationLocationCode = this.myForm.get('goingTo')?.value.iataCode,
        searchData.originDestinations[0].departureDateTimeRange.date = this.formatDate(this.myForm.get('roundDatesDeparture')?.value),
        searchData.originDestinations[0].departureDateTimeRange.time = this.formattime(this.myForm.get('roundDatesDeparture')?.value)
      return searchData;
    }


  }
  getLastSegmentArrivalDetails(flight: any): any {
    if (!flight.itineraries || flight.itineraries.length === 0) {
      return null; // No itineraries found
    }

    const segments = flight.itineraries[0].segments;

    if (!segments || segments.length === 0) {
      return null; // No segments found
    }

    if (segments.length > 1) {
      // Return arrival details of the last segment
      const lastSegment = segments[segments.length - 1];
      const departCity = this.getCityName(segments[0].departure.iataCode, flight);
      const arrivalCity = this.getCityName(lastSegment.arrival.iataCode, flight);
      return {
        time: lastSegment.arrival.at,
        deapartureIataCode: departCity,
        deapartureTime: segments[0].departure.at,
        iataCode: arrivalCity
      };
    }
  }
  getAirportDetails(segments: any[], flight: any): string {
    let details = '';

    segments.forEach((segment, index) => {
      const departureTime = new Date(segment.departure.at);
      const arrivalTime = new Date(segment.arrival.at);
      const durationMs = arrivalTime.getTime() - departureTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs / (1000 * 60)) % 60);
      const depart = this.getCityName(segment.departure.iataCode, flight);
      const arrival = this.getCityName(segment.arrival.iataCode, flight);
      details += `Plane change \n`;
      details += `${depart} at ${departureTime.toLocaleString()} `;
      details += `to ${arrival} at ${arrivalTime.toLocaleString()} \n`;
      details += `Duration: ${durationHours} hours ${durationMinutes} minutes \n\n`;
    });
    return details;
  }
  convertSimpleDuration(duration: string): string {
    // Extract hours and minutes using regular expressions
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
  
    // Default to 0 hours and 0 minutes if not found
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  
    // Build the formatted duration string
    let result = '';
    if (hours > 0) {
      result += `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result.length > 0) result += ' ';
      result += `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    return result || '0 min'; // Fallback if no hours or minutes
  }
  getNextAirportIATACodes(flight: any): string[] {
    const iataCodes: any[] = [];
    const segments = flight.itineraries[0].segments;
    for (let i = 0; i < segments.length - 1; i++) {
      const city = this.getCityName(segments[i + 1].departure.iataCode, flight)
      iataCodes.push(city);
    }

    return iataCodes;
  }

  isConnectingFlightEmpty(flight: any): boolean {
    if (!flight.itineraries || flight.itineraries.length === 0) {
      return false; // No itineraries found, indicating a non-stop flight
    }
    const segments = flight.itineraries[0].segments;
    if (!segments || segments.length <= 1) {
      return false; // No connecting flights found
    }
    return true; // Connecting flight found
  }


  getDuration(arrivalTime: any, departureTime: any) {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    // Calculate duration in milliseconds
    const durationMs = departure.getTime() - arrival.getTime();
    // Convert milliseconds to hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    // Set the duration string
    const duration = hours + " hours and " + minutes + " min";
    return duration;
  }
  getMultiCityFormData(index: number) {
    const multiCityFlights = this.myForm.get('multiCityFlights')?.value;
    const firstFlight = multiCityFlights[index];
    const originLocationCode = firstFlight.leavingFrom.iataCode;
    const destinationLocationCode = firstFlight.goingTo.iataCode;
    const departureDateTimeRange = this.formatDate(firstFlight.departDate);
    return {
      origin: originLocationCode,
      depart: destinationLocationCode,
      departureDate: departureDateTimeRange,
      adults: this.totalTravelers,
      max: 50,
      travelClass: this.myForm.get('selectedTravelClass')?.value
    }
  }


  areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }
  selectedDateBox(index: number, dateSelected: any) {

    const selectedDate = new Date(dateSelected.completeDate);
    const currentDatesValue = this.myForm.get('roundDatesDeparture')?.value;
    const currentDateValueDate = new Date(currentDatesValue);
    if (!this.areDatesEqual(selectedDate, currentDateValueDate)) {
      this.myForm.get('roundDatesDeparture')?.setValue(selectedDate);
      this.centerBoxIndex = index;
      this.SearchFlight();
    }else{
      this.myForm.get('roundDatesDeparture')?.setValue(selectedDate);
      this.centerBoxIndex = index;
      this.SearchFlight();
    }
    
  }
  getAminities(flightOffer:any){
  const amenities = flightOffer.travelerPricings[0].fareDetailsBySegment[0].amenities;
const hasPreReservedSeat = this.hasPreReservedSeatAmenity(amenities);
  }
   hasPreReservedSeatAmenity(amenities: any[]): boolean {
    return amenities.some(amenity => amenity.amenityType === 'PRE_RESERVED_SEAT');
  }

 

  //Function To format data
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

  filterFlights(flights: any[], filters: any): any[] {
    let filteredFlights = flights;
    if (filters.numberOfStopes && filters.numberOfStopes.length > 0) {
      filteredFlights = filteredFlights.filter(flight => filters.numberOfStopes.includes(flight.itineraries[0].segments.length));
    }
    if (filters.commonNames && filters.commonNames.length > 0) {
      filteredFlights = filteredFlights.filter(flight => filters.commonNames.includes(flight.airlines[0].commonName));
    }
    if (filters.departureTime) {
      const timeCategories: Record<string, any> = {
        morning: { start: 6, end: 12 },
        afternoon: { start: 12, end: 18 },
        evening: { start: 18, end: 24 }
      };

      filteredFlights = filteredFlights.filter(flight => {
        const departureTime = new Date(flight.itineraries[0].segments[0].departure.at).getHours();
        const filterTimeCategory = filters.departureTime.toLowerCase();
        const { start, end } = timeCategories[filterTimeCategory];

        return departureTime >= start && departureTime < end;
      });
    }
    if (filters.arrivalTime) {
      const timeCategories: Record<string, any> = {
        morning: { start: 6, end: 12 },
        afternoon: { start: 12, end: 18 },
        evening: { start: 18, end: 24 }
      };

      filteredFlights = filteredFlights.filter(flight => {
        const lastSegmentIndex = flight.itineraries[0].segments.length - 1;
        let arrivalTime;
        // Check if there's a connecting flight and if it has an arrival time
        if (flight.itineraries[0].segments[lastSegmentIndex].connectingFlight && flight.itineraries[0].segments[lastSegmentIndex].connectingFlight.arrival) {
          // Extract arrival time from the connecting flight
          arrivalTime = new Date(flight.itineraries[0].segments[lastSegmentIndex].connectingFlight.arrival.at).getHours();
        } else {
          // Extract arrival time from the last segment of the main flight
          arrivalTime = new Date(flight.itineraries[0].segments[lastSegmentIndex].arrival.at).getHours();
        }
        const filterTimeCategory = filters.arrivalTime.toLowerCase();
        const { start, end } = timeCategories[filterTimeCategory];
        return arrivalTime >= start && arrivalTime < end;
      });
    }
    return filteredFlights;
  }

  filterFlightsData(): void {
    const filters: { numberOfStopes: (string | number)[], commonNames: (string | number)[], departureTime: any, arrivalTime: any } = {
      numberOfStopes: [],
      commonNames: [],
      departureTime: '',
      arrivalTime: ''
    };
    this.SelectedFilterArray.forEach((entry: any) => {
      if (entry.typeId === "Stops") {
        let numberOfStopsValue = 1;
        if (typeof entry.category === 'number') {
          numberOfStopsValue = entry.category + 1;
        }
        filters.numberOfStopes.push(numberOfStopsValue);
      } else if (entry.typeId === "airline") {
        if (entry.lowestPrice) {
          filters.commonNames.push(entry.category);
        }
      }
      else if (entry.typeId === "DepartureTime") {
        filters.departureTime = entry.category;
      }
      else if (entry.typeId === "arrivalTime") {
        filters.arrivalTime = entry.category;
      }

    });
    let Filterarray;
    if (this.selectedTripType == 'multiCity') {
      Filterarray = this.MultiCityFlightData;
      this.flightDataMultiCity = this.filterFlights(Filterarray, filters);
    }
    else if (this.selectedTripType == 'roundTrip') {
      Filterarray = this.FlightResult;

      this.flightData = this.filterFlights(Filterarray, filters);
    }
    else {
      Filterarray = this.FlightResultOneWay;
      this.flightOneWayData = this.filterFlights(Filterarray, filters);
    }

  }

  applyFilters() {
    this.filterFlightsData();
  }
  getFlightdataSort(event: any) {
    this.loading = true;
    if (this.selectedTripType == 'roundTrip') {
      this.getFlightdataSortRound(event);
    } else {
      const flightData = this.selectedTripType == 'oneway' ? this.flightOneWayData : this.flightDataMultiCity;
      const selectedSortOption = event.value;

      switch (selectedSortOption) {
        case 'priceLowest':
          flightData.sort((a: any, b: any) => parseFloat(a.price.total) - parseFloat(b.price.total));
          break;
        case 'priceHighest':
          flightData.sort((a: any, b: any) => parseFloat(b.price.total) - parseFloat(a.price.total));
          break;
        case 'durationShortest':
          flightData.sort((a: any, b: any) => this.getDurationInSeconds(a.itineraries[0].duration) - this.getDurationInSeconds(b.itineraries[0].duration));
          break;
        case 'durationLongest':
          flightData.sort((a: any, b: any) => this.getDurationInSeconds(b.itineraries[0].duration) - this.getDurationInSeconds(a.itineraries[0].duration));
          break;
        case 'departureEarliest':
          flightData.sort((a: any, b: any) => new Date(a.itineraries[0].segments[0].departure.at).getTime() - new Date(b.itineraries[0].segments[0].departure.at).getTime());
          break;
        case 'departureLatest':
          flightData.sort((a: any, b: any) => new Date(b.itineraries[0].segments[0].departure.at).getTime() - new Date(a.itineraries[0].segments[0].departure.at).getTime());
          break;
        case 'arrivalEarliest':
          flightData.sort((a: any, b: any) => new Date(a.itineraries[0].segments[a.itineraries[0].segments.length - 1].arrival.at).getTime() - new Date(b.itineraries[0].segments[b.itineraries[0].segments.length - 1].arrival.at).getTime());
          break;
        case 'arrivalLatest':
          flightData.sort((a: any, b: any) => new Date(b.itineraries[0].segments[b.itineraries[0].segments.length - 1].arrival.at).getTime() - new Date(a.itineraries[0].segments[a.itineraries[0].segments.length - 1].arrival.at).getTime());
          break;
        default:
          break;
      }

      this.loading = false;
    }
  }

  priceDatelist(index: any) {
    const prices = ['345', '500', '750', '200', '100', '150', '250'];
    if (index >= 0 && index < prices.length) {
      return prices[index];
    } else {
      return "Index out of range";
    }
  }
  getFlightdataSortRound(event: any) {
    this.loading = true;

    const selectedSortOption = event.value;

    switch (selectedSortOption) {
      case 'priceLowest':
        this.flightData.sort((a: any, b: any) => parseFloat(a.price.total) - parseFloat(b.price.total));
        break;
      case 'priceHighest':
        this.flightData.sort((a: any, b: any) => parseFloat(b.price.total) - parseFloat(a.price.total));
        break;
      case 'durationShortest':

        this.flightData.sort((a: any, b: any) => this.getDurationInSeconds(a.itinerary[0].duration) - this.getDurationInSeconds(b.itinerary[0].duration));
        break;
      case 'durationLongest':
  
        this.flightData.sort((a: any, b: any) => this.getDurationInSeconds(b.itinerary[0].duration) - this.getDurationInSeconds(a.itinerary[0].duration));
        break;
      case 'departureEarliest':
        this.flightData.sort((a: any, b: any) => new Date(a.itinerary[0].segments.departure.at).getTime() - new Date(b.itinerary[0].segments.departure.at).getTime());
        break;
      case 'departureLatest':
        this.flightData.sort((a: any, b: any) => new Date(b.itinerary[0].segments.departure.at).getTime() - new Date(a.itinerary[0].segments.departure.at).getTime());
        break;
      case 'arrivalEarliest':
        this.flightData.sort((a: any, b: any) => new Date(a.itinerary[0].segments.arrival.at).getTime() - new Date(b.itinerary[0].segments.arrival.at).getTime());
        break;
      case 'arrivalLatest':
        this.flightData.sort((a: any, b: any) => new Date(b.itinerary[0].segments.arrival.at).getTime() - new Date(a.itinerary[0].segments.arrival.at).getTime());
        break;
      default:
        break;
    }

    this.loading = false;
  }

  getDurationInSeconds(duration: string): number {

    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) * 3600 : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) * 60 : 0;

    return hours + minutes;
}

  getFilterFunctionWithItinerary() {

    this.StopsFilter = [];
    this.airlineFilter = [];
    this.arrivalFilter = [];
    this.departureFilter = [];

    let filterArray: any = [];
    if (this.selectedTripType == 'multiCity') {
      filterArray = this.flightDataMultiCity;
    } else if (this.selectedTripType == 'roundTrip') {
      filterArray = this.flightData;
    } else {
      filterArray = this.flightOneWayData;
    }

    const Stops = [...new Set(filterArray.map((flight: any) => flight.itineraries[0].segments.length - 1))];
    Stops.forEach((option: any) => {
      const flightsInCategory = filterArray.filter((flight: any) => flight.itineraries[0].segments.length - 1 === option);
      const lowestPriceFlight = flightsInCategory.reduce((minFlight: any, flight: any) => {
        return (parseFloat(flight.price.total) < parseFloat(minFlight.price.total)) ? flight : minFlight;
      });
      const categoryWithPrice = {
        category: option,
        lowestPrice: lowestPriceFlight.price.total,
        checked: false,
        typeId: 'Stops',
      };
      this.StopsFilter.push(categoryWithPrice);
    });

    const airlines = new Set(filterArray.map((flight: any) => flight.airlines[0].commonName));
    airlines.forEach((airlineName) => {
      const flightsByAirline = filterArray.filter((flight: any) => flight.airlines[0].commonName === airlineName);
      const lowestPriceFlight = flightsByAirline.reduce((minFlight: any, flight: any) => {
        return (parseFloat(flight.price.total) < parseFloat(minFlight.price.total)) ? flight : minFlight;
      });
      const airlineWithPrice = {
        category: airlineName,
        typeId: 'airline',
        lowestPrice: lowestPriceFlight.price.total,
        checked: false
      };
      this.airlineFilter.push(airlineWithPrice);
    });

    const optionsData = this.getFlightTimeCategory(filterArray);
    optionsData.arrivalCategories.forEach((option: any) => {
      const arrivalCategory = {
        category: option,
        typeId: 'arrivalTime',
        checked: false,
      };
      this.arrivalFilter.push(arrivalCategory);
    });
    optionsData.departureCategories.forEach((option: any) => {
      const departureCategory = {
        category: option,
        typeId: 'DepartureTime',
        checked: false,
      };

      this.departureFilter.push(departureCategory);
    });
  }

  clearSelection() {
    // Clear the selection
    this.departureFilter.forEach((item: { checked: boolean; }) => item.checked = false);
    const radioButtons = document.getElementsByName('departure-time') as NodeListOf<HTMLInputElement>;
    radioButtons.forEach(rb => rb.checked = false);
    this.clearFilter();
  }
  clearArrivalSelection() {
    this.arrivalFilter.forEach((item: { checked: boolean; }) => item.checked = false);
    const radioButtons = document.getElementsByName('Arrival-Time') as NodeListOf<HTMLInputElement>;
    radioButtons.forEach(rb => rb.checked = false);
    this.clearFilter();
  }

  getFlightTimeCategory(flightData: any[]): any {
    const morningRange = { start: 5, end: 11 };
    const afternoonRange = { start: 12, end: 17 };
    const eveningRange = { start: 18, end: 23 };

    let departureCategories: string[] = [];
    let arrivalCategories: string[] = [];

    flightData.forEach(flight => {
      flight.itineraries[0].segments.forEach((segment: { departure: { at: string | number | Date; }; arrival: { at: string | number | Date; }; }) => {
        const departureTime = new Date(segment.departure.at).getHours();
        const arrivalTime = new Date(segment.arrival.at).getHours();

        if (departureTime >= morningRange.start && departureTime <= morningRange.end) {
          departureCategories.push('Morning');
        } else if (departureTime >= afternoonRange.start && departureTime <= afternoonRange.end) {
          departureCategories.push('Afternoon');
        } else if (departureTime >= eveningRange.start && departureTime <= eveningRange.end) {
          departureCategories.push('Evening');
        }

        if (arrivalTime >= morningRange.start && arrivalTime <= morningRange.end) {
          arrivalCategories.push('Morning');
        } else if (arrivalTime >= afternoonRange.start && arrivalTime <= afternoonRange.end) {
          arrivalCategories.push('Afternoon');
        } else if (arrivalTime >= eveningRange.start && arrivalTime <= eveningRange.end) {
          arrivalCategories.push('Evening');
        }
      });
    });
    departureCategories = Array.from(new Set(departureCategories));
    arrivalCategories = Array.from(new Set(arrivalCategories));

    return { departureCategories, arrivalCategories };
  }

  getDepartureTimeRange(category: string): string {
    switch (category) {
      case 'Morning':
        return '(5:00am - 11:59am)';
      case 'Afternoon':
        return '(12:00pm - 5:59pm)';
      case 'Evening':
        return '(6:00pm - 11:59pm)';
      default:
        return '';
    }
  }

  changeSelectedFlight(index: any) {
    this.activeIndex = index;
    this.showTicketSummarry = false;
    this.selectedSeats = [];
  }
  flightInfo(flight: any) {

    this.isLoading = true;
    let flightResult: any = [];
    let indexofFlight: any;
    this.flightService.getFlightOffers(flight).subscribe((result: any) => {
      let flightdata: any = [];
      flightResult = result;
      flightdata = result;
      this.isLoading = false;
      if(result.data){
        const dialogRef = this.dialog.open(SelectFlightComponent, {
          width: '800px',
          data: {
  
            data1: flightdata,
            data2: indexofFlight,
            amenities:flight
  
          },
          panelClass: ['flightComponentpopup']
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result === 'selected') {
            if (this.selectedTripType == 'oneway') {
              this.showSeatSelection = true;
              this.openSeatSelection(flight, 0, flightResult.data.data);
            }
            else if (this.selectedTripType == 'roundTrip') {
              this.showSeatSelection = true;
              this.openSeatSelection(flight, 0, flightResult.data.data);
            }
            else {
              this.showSeatSelection = true;
              this.openSeatSelection(flight, 0, flightResult.data.data);
            }
          }
        });
      }
      else{
        if(result.amadeusMessage){
          this.snackBarService.showSnackBar(result.amadeusMessage, 'custom-snackbar-error');
        }else{
          this.snackBarService.showSnackBar(result.message, 'custom-snackbar-error');
        }
      }
  
    },
      (error) => {
        this.snackBarService.showSnackBar(error, 'custom-snackbar-error');
        this.isLoading = false;
      }
    )

  }
 
  matchData(index: any) {

    const indexAsString = index.toString();
    const storedData = sessionStorage.getItem(indexAsString);
    if (storedData) {

      this.MultiCityFlightData = JSON.parse(storedData);
      this.flightDataMultiCity = JSON.parse(storedData);

    }
    const matchingFlight = this.selectedFlightsMultiCity.find(data => {
      return this.flightDataMultiCity.some(flight => flight.id === data.flightData.id);
    });



  }
  combineFlightOffers(flightDataArray: any[]): any[] {
    const combinedFlightOffers: any = [];

    flightDataArray.forEach(flightData => {
      if (flightData && flightData.data && flightData.data.flightOffers) {
        combinedFlightOffers.push(...flightData.data.flightOffers);
      }
    });

    return combinedFlightOffers;
  }


  openSeatSelection(flight: any, index?: any, flightResult?: any) {
    this.isLoading = true;
    flight.pricingOptions.fareType = ["PUBLISHED"];
    let flightValue = JSON.parse(JSON.stringify(flight));

    this.flightService.seatSelection(flightValue).subscribe(result => {
      this.isLoading = false;
      debugger;
      if(result.data &&result.data.length >0){
        const dialogRef = this.dialog.open(SelectSeatComponent, {
          width: '800px',
          data: {
            data1: result,
            data2: this.travelersCount,
            data3: flightValue,
            data4: this.selectedSeats[this.activeIndex],
            data5: this.showSeatSelection
          },
          panelClass: ['seatComponentpopup'],
        });
        dialogRef.afterClosed().subscribe(result => {
          debugger;
          if (Array.isArray(result)) {
            this.showSeatSelection = false;
            
            if (this.selectedTripType == 'oneway') {
              this.selectedSeats[this.activeIndex] = [];
              this.flightSelectedArray = [];
              this.selectedSeats[this.activeIndex] = result;
              this.flightSelectedArray.push(flight);
              this.selectedFlightOffer = [];
              this.selectedFlightOffer.push(flightResult);
              const flightOffers = flightResult.flightOffers;
              flightOffers.forEach((flightOffer: any) => {
                const airlineName = flightResult.airlines[0].commonName;
                const departureAirportIATACode = flightOffer.itineraries[0].segments[0].departure.iataCode;
                const arrivalAirportIATACode = flightOffer.itineraries[0].segments[0].arrival.iataCode;
  
                if (this.flightSelected[this.activeIndex]) {
                  this.flightSelected[this.activeIndex] = {
                    airlineName: airlineName,
                    departureAirportIATACode: departureAirportIATACode,
                    arrivalAirportIATACode: arrivalAirportIATACode
                  }
                }
                else {
                  this.flightSelected.push({
                    airlineName: airlineName,
                    departureAirportIATACode: departureAirportIATACode,
                    arrivalAirportIATACode: arrivalAirportIATACode
                  });
                }
  
              });
              let arr = this.combineFlightOffers(this.selectedFlightOffer);
              this.activeIndex = 1;
              this.showTicketSummarry = true;
            }
            else if (this.selectedTripType == 'roundTrip') {
              this.selectedSeats[this.activeIndex] = result;
  
              if (this.flightSelectedArray[this.activeIndex]) {
                this.flightSelectedArray[this.activeIndex] = flight;
  
              } else {
  
                this.flightSelectedArray.push(flight);
              }
  
              const flightOffers = flightResult.flightOffers;
              if (this.selectedFlightOffer[this.activeIndex]) {
                this.selectedFlightOffer[this.activeIndex] = flightResult;
  
              } else {
  
                this.selectedFlightOffer.push(flightResult);
              }
  
              flightOffers.forEach((flightOffer: any) => {
                const airlineName = flightResult.airlines[0].commonName;
                const departureAirportIATACode = flightOffer.itineraries[0].segments[0].departure.iataCode;
                const arrivalAirportIATACode = flightOffer.itineraries[0].segments[0].arrival.iataCode;
  
                if (this.flightSelected[this.activeIndex]) {
                  this.flightSelected[this.activeIndex] = {
                    airlineName: airlineName,
                    departureAirportIATACode: departureAirportIATACode,
                    arrivalAirportIATACode: arrivalAirportIATACode
                  }
                }
                else {
                  this.flightSelected.push({
                    airlineName: airlineName,
                    departureAirportIATACode: departureAirportIATACode,
                    arrivalAirportIATACode: arrivalAirportIATACode
                  });
                }
  
              });
  
              if (this.activeIndex == 0) {
                this.handleTripClick(1);
              }
  
              else {
                this.showSeatSelection = false;
                this.activeIndex = 3;
                let arr = this.combineFlightOffers(this.selectedFlightOffer);
                this.showTicketSummarry = true;
              }
  
            }
            else {

              this.selectedSeats[this.activeIndex] = [];
              this.selectedSeats[this.activeIndex] = result;
  
              if (this.flightSelectedArray[this.activeIndex]) {
                this.flightSelectedArray[this.activeIndex] = flight;
  
              } else {
  
                this.flightSelectedArray.push(flight);
              }
  
              const flightOffers = flightResult.flightOffers;
              if (this.selectedFlightOffer[this.activeIndex]) {
                this.selectedFlightOffer[this.activeIndex] = flightResult;
              } else {
                this.selectedFlightOffer.push(flightResult);
              }
  
              flightOffers.forEach((flightOffer: any) => {
                const airlineName = flightResult.airlines[0].commonName;
                const departureAirportIATACode = flightOffer.itineraries[0].segments[0].departure.iataCode;
                const arrivalAirportIATACode = flightOffer.itineraries[0].segments[0].arrival.iataCode;
  
                if (this.flightSelected[this.activeIndex]) {
                  this.flightSelected[this.activeIndex] = {
                    airlineName: airlineName,
                    departureAirportIATACode: departureAirportIATACode,
                    arrivalAirportIATACode: arrivalAirportIATACode
                  }
                }
                else {
                  this.flightSelected.push({
                    airlineName: airlineName,
                    departureAirportIATACode: departureAirportIATACode,
                    arrivalAirportIATACode: arrivalAirportIATACode
                  });
                }
  
              });
  
              if (this.flightMultiCitySearchDetail.length > this.selectedFlight) {
                const index = this.selectedFlight + 1;
  
                if (this.flightMultiCitySearchDetail.length == index) {
                  this.selectedFlightsMultiCity.push({ index: this.selectedFlight, flightData: flight });
                  let arr = this.combineFlightOffers(this.selectedFlightOffer);
                  this.showTicketSummarry = true;
                }
                else {
                  this.showSeatSelection = false;
                  this.selectedFlightsMultiCity.push({ index: this.selectedFlight, flightData: flight });
  
                  this.handleTripClick(index);
                  this.matchData(this.activeIndex);
                }
              }
            }
            // Process the array here
          } else {
            this.showSeatSelection = false;
            this.snackBarService.showSnackBar('Seat choice not avaiable <br> After Booking please contact the airline' , 'custom-snackbar-error');
          }
        });
      }else{
        console.log(this.showSeatSelection)
        if(!this.showSeatSelection){
          this.snackBarService.showSnackBar('Seat choice not avaiable.After Booking please contact the airline' , 'custom-snackbar-error');
        }
        if (this.selectedTripType == 'oneway') {
          this.selectedSeats[this.activeIndex] = [];
          this.flightSelectedArray = [];
          this.flightSelectedArray.push(flight);
          this.selectedFlightOffer = [];
          this.selectedFlightOffer.push(flightResult);
          const flightOffers = flightResult.flightOffers;
          flightOffers.forEach((flightOffer: any) => {
            const airlineName = flightResult.airlines[0].commonName;
            const departureAirportIATACode = flightOffer.itineraries[0].segments[0].departure.iataCode;
            const arrivalAirportIATACode = flightOffer.itineraries[0].segments[0].arrival.iataCode;

            if (this.flightSelected[this.activeIndex]) {
              this.flightSelected[this.activeIndex] = {
                airlineName: airlineName,
                departureAirportIATACode: departureAirportIATACode,
                arrivalAirportIATACode: arrivalAirportIATACode
              }
            }
            else {
              this.flightSelected.push({
                airlineName: airlineName,
                departureAirportIATACode: departureAirportIATACode,
                arrivalAirportIATACode: arrivalAirportIATACode
              });
            }

          });
          let arr = this.combineFlightOffers(this.selectedFlightOffer);
          this.activeIndex = 1;
          this.showTicketSummarry = true;
        }
        else if (this.selectedTripType == 'roundTrip') {
    
          this.selectedSeats[this.activeIndex] = [];
          if (this.flightSelectedArray[this.activeIndex]) {
            this.flightSelectedArray[this.activeIndex] = flight;

          } else {

            this.flightSelectedArray.push(flight);
          }

          const flightOffers = flightResult.flightOffers;
          if (this.selectedFlightOffer[this.activeIndex]) {
            this.selectedFlightOffer[this.activeIndex] = flightResult;

          } else {

            this.selectedFlightOffer.push(flightResult);
          }

          flightOffers.forEach((flightOffer: any) => {
            const airlineName = flightResult.airlines[0].commonName;
            const departureAirportIATACode = flightOffer.itineraries[0].segments[0].departure.iataCode;
            const arrivalAirportIATACode = flightOffer.itineraries[0].segments[0].arrival.iataCode;

            if (this.flightSelected[this.activeIndex]) {
              this.flightSelected[this.activeIndex] = {
                airlineName: airlineName,
                departureAirportIATACode: departureAirportIATACode,
                arrivalAirportIATACode: arrivalAirportIATACode
              }
            }
            else {
              this.flightSelected.push({
                airlineName: airlineName,
                departureAirportIATACode: departureAirportIATACode,
                arrivalAirportIATACode: arrivalAirportIATACode
              });
            }

          });

          if (this.activeIndex == 0) {
            this.handleTripClick(1);
          }

          else {
            this.showSeatSelection = false;
            this.activeIndex = 3;
            let arr = this.combineFlightOffers(this.selectedFlightOffer);
            this.showTicketSummarry = true;
          }

        }
        else {

          this.selectedSeats[this.activeIndex] = [];
   

          if (this.flightSelectedArray[this.activeIndex]) {
            this.flightSelectedArray[this.activeIndex] = flight;

          } else {

            this.flightSelectedArray.push(flight);
          }

          const flightOffers = flightResult.flightOffers;
          if (this.selectedFlightOffer[this.activeIndex]) {
            this.selectedFlightOffer[this.activeIndex] = flightResult;
          } else {
            this.selectedFlightOffer.push(flightResult);
          }

          flightOffers.forEach((flightOffer: any) => {
            const airlineName = flightResult.airlines[0].commonName;
            const departureAirportIATACode = flightOffer.itineraries[0].segments[0].departure.iataCode;
            const arrivalAirportIATACode = flightOffer.itineraries[0].segments[0].arrival.iataCode;

            if (this.flightSelected[this.activeIndex]) {
              this.flightSelected[this.activeIndex] = {
                airlineName: airlineName,
                departureAirportIATACode: departureAirportIATACode,
                arrivalAirportIATACode: arrivalAirportIATACode
              }
            }
            else {
              this.flightSelected.push({
                airlineName: airlineName,
                departureAirportIATACode: departureAirportIATACode,
                arrivalAirportIATACode: arrivalAirportIATACode
              });
            }

          });

          if (this.flightMultiCitySearchDetail.length > this.selectedFlight) {
            const index = this.selectedFlight + 1;

            if (this.flightMultiCitySearchDetail.length == index) {
              this.selectedFlightsMultiCity.push({ index: this.selectedFlight, flightData: flight });
              let arr = this.combineFlightOffers(this.selectedFlightOffer);
              this.showTicketSummarry = true;
            }
            else {
              this.showSeatSelection = false;
              this.selectedFlightsMultiCity.push({ index: this.selectedFlight, flightData: flight });

              this.handleTripClick(index);
              this.matchData(this.activeIndex);
            }
          }
        }
      }
  
    });


  }
  // getImageUrl(airlineCode:any){
  //   this.airLineService.getAirLineIcon(airlineCode).subscribe(result=>{
  //     return result;
  //   })
  // }
  getImageUrl(imageName: string): string {
    return `assets/airline/${imageName}.png`;
  }
  formattime(selectedDate: any) {
    const date = new Date(selectedDate);
    const hours = ('0' + date.getHours()).slice(-2);         // Get hours with leading zero
    const minutes = ('0' + date.getMinutes()).slice(-2);     // Get minutes with leading zero
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const formattedtime = `${hours}:${minutes}:${seconds}`;
    return formattedtime;

  }
  panelOpenState = false;

  activeClasses: { [key: string]: boolean } = {
    class1: true,
    class2: true,
    class3: true,
    class4: true,
    class5:true
  };

  toggleClass(acco: string) {
    this.activeClasses[acco] = !this.activeClasses[acco];
  }

}