import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FlightServiceService } from 'src/app/services/flight-service.service';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { SessionService } from 'src/app/services/session.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StripeService } from 'src/app/services/stripe.service';
import { TaxService } from 'src/app/services/tax.service';

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.scss']
})
export class FlightBookingComponent {
  panelOpenState = false;

  paymentForm!: FormGroup;
  formData: any;
  stripeResponse: any;
  stripeSessionId: any;
  flightDetails: any[] = [];
  flightData: any = [];
  numTravelers: number = 1;
  TravellerDetails: any;
  totalForAllTravelers: any;
  typeOfTraveller: any = [];
  tripType: any;
  isLoading: boolean = false;
  cityDetail: any = [];
  travellerData: any = [];
  selectedTraveller: any = [];
  excedTravllerMessage: boolean = false;
  totalInfant: any = 0;
  additionalPrices: any=[];
  tripTotal: number=0;
  previousValues: { [index: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private paymentService: FlightServiceService,
    public flightService: FlightsearchService,
    private sessionService: SessionService,
    private authService: AuthService,
    private snackBarService:SnackbarService,
    private tax:TaxService,
  ) {
  }
  extractDateTime(dateTimeString: any) {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const day = dateTime.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day}, ${date}`;
  }
  extractTime(dateTimeString: any) {
    const dateTime = new Date(dateTimeString);
    const time = dateTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
    return `${time}`;
  }
  ngOnInit() {

    this.tripType = localStorage.getItem('tripType')?.replace(/"/g, '');
    const traveller = localStorage.getItem('traveler');
    if (traveller) {
      this.travellerData = JSON.parse(traveller);
    }

    this.flightService.paymentData$.subscribe(data => {
      this.flightData = data;
    
      // Extract city details
      for (let i = 0; i < this.flightData.length; i++) {
        this.cityDetail.push(...this.flightData[i].arrivalCitys);
        this.cityDetail.push(...this.flightData[i].departureCitys);
      }
    
      // Extract flight details
      for (let i = 0; i < this.flightData[0].flightOffers.length; i++) {
        const flight = this.flightData[0].flightOffers[i];
        const itinerary = flight.itineraries[0];
        const segment = itinerary.segments[0];
        
        // Extract taxes and refundable taxes
        const travelerPricing = flight.travelerPricings[0];
        const taxes = travelerPricing.price.taxes;
        const refundableTaxes = travelerPricing.price.refundableTaxes;
    
        // Convert taxes array to a dictionary for easier access
        const taxAmounts: { [key: string]: number } = {};
        if (taxes) {
          taxes.forEach((tax: { code: string | number; amount: string; }) => {
            taxAmounts[tax.code] = parseFloat(tax.amount);
          });
        }
    
        // Calculate total taxes and refundable taxes
        const totalTaxes = Object.values(taxAmounts).reduce((acc, amount) => acc + amount, 0);
        const refundableTaxTotal = refundableTaxes ? parseFloat(refundableTaxes) : 0;
    
        this.flightDetails.push({
          from: this.getCityName(segment.departure.iataCode),
          to: this.getCityName(segment.arrival.iataCode),
          date: this.extractDateTime(segment.departure.at),
          departureTime: this.extractTime(segment.departure.at),
          arrivalTime: this.extractTime(segment.arrival.at),
          duration: segment.duration,
          Total: flight.price.total,
          RefundableTaxes: refundableTaxTotal,
          OtherTaxes: totalTaxes - refundableTaxTotal, // Assuming refundable taxes are included in total taxes
        });
      }
    });
    this.flightService.travelData$.subscribe(data => {
      this.numTravelers = data.adult + data.children + data.infantOnSeat + data.infantOnlap;
      this.typeOfTraveller = data;
    });

    this.paymentForm = this.fb.group({
      travellers: this.fb.array([]),
      child: this.fb.array([]),
      infant: this.fb.array([]),
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      agree:  [false, Validators.requiredTrue] 
    });

    for (let i = 0; i < this.typeOfTraveller.children; i++) {
      this.child().push(this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        Gender: ['Male', Validators.required],
      })
      );
    }
    this.totalInfant = this.typeOfTraveller.infantOnSeat + this.typeOfTraveller.infantOnlap
    for (let i = 0; i < this.totalInfant; i++) {
      this.infant().push(this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        Gender: ['Male', Validators.required],
        DOB: ['', Validators.required],
      })
      );

    }
    for (let i = 0; i < this.typeOfTraveller.adult; i++) {

      this.travellers().push(this.fb.group({
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        DOB: ['', [Validators.required, this.minimumAgeValidator(18)]],
        Gender: ['Male', Validators.required],
        email: ['', [Validators.email]],
        phoneNumber: ['', [Validators.pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)]]
      }));
    }
    if (this.authService.isLoggedIn()) {
      const userData = localStorage.getItem('UserData');
      if (userData) {
        const data = JSON.parse(userData);
        this.paymentForm.patchValue({
          phoneNumber: data.mobileNumber,
          email: data.email
        });
      }

    }
this.getTaxAmount();
  }
  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dob = control.value;
      if (!dob) return null;

      const today = new Date();
      const birthDate = new Date(dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (age > minAge || (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))) {
        return null;
      }

      return { notAdult: true };
    };
  }
  getChargeableSeatPrice(data: any[]): number {
  
    return data.reduce((total, item) => {
      const chargeableSeatNumber = item.additionalServices?.chargeableSeatNumber;
      const seatPrice = chargeableSeatNumber ? 50 : 0; 
      return total + seatPrice;
    }, 0);
  }

  getTotalAmount(data: { amount: string; type: string }[]): number {
    return data.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);
  }
  onCheckboxChange(travel: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    if (isChecked) {
      this.selectedTraveller.push(travel);
      const index = this.selectedTraveller.length - 1;
      if (this.selectedTraveller.length <= this.numTravelers) {
        this.excedTravllerMessage = false;
        this.patchTraveller(travel, index);
      }
      else {
        checkbox.checked = false;
        this.selectedTraveller.splice(index, 1);
        this.excedTravllerMessage = true;
      }

    } else {
      this.excedTravllerMessage = false;
      const index = this.selectedTraveller.length - 1;
      if (index != -1) {
        this.selectedTraveller.splice(index, 1);
        this.resetTraveller(index);
      }

    }
  }
  resetTraveller(index: number) {
    const travller = this.paymentForm.get('travellers') as FormArray;
    const travellerData = travller.at(index) as FormGroup;
    travellerData.reset();
  }
  patchTraveller(travel: any, index: number) {
    const travller = this.paymentForm.get('travellers') as FormArray;
    const travellerData = travller.at(index) as FormGroup;
    travellerData.patchValue({
      firstName: travel.firstName,
      middleName: travel.middleName,
      lastName: travel.lastName,
      DOB: travel.DOB,
      Gender: travel.Gender,
      email: travel.email,
      phoneNumber: travel.phoneNumber
    });
  }
  child(): FormArray {
    return this.paymentForm.get('child') as FormArray;
  }
  travellers(): FormArray {
    return this.paymentForm.get('travellers') as FormArray;
  }
  infant(): FormArray {
    return this.paymentForm.get('infant') as FormArray;
  }
  calculateGrandTotal(): any {

    let grandTotal = 0;
    for (let i = 0; i < this.flightData[0].flightOffers.length; i++) {
      grandTotal += parseFloat(this.flightData[0].flightOffers[i].price.grandTotal);
    }
    const totalprice= grandTotal * this.numTravelers;
    return totalprice.toFixed(2);
  }
  getTaxAmount(){
    const amount = this.calculateGrandTotal();
    this.tax.getTaxAmount(amount).subscribe((response:any)=>{
      this.additionalPrices=response.data.item1
      this.tripTotal = response.data.item2;
      this.totalForAllTravelers=this.tripTotal;
    })
  }

  submit() {
    this.isLoading = true;
    this.TravellerDetails = this.paymentForm.value;
    const amount = this.totalForAllTravelers;

    this.paymentService.sendFormData(amount).subscribe(
      response => {
        this.stripeResponse = response.data;
        this.stripeSessionId = response.data.sessionId;
        this.sessionService.setStripeSessionId(this.stripeSessionId);
        this.sessionService.stripeSessionId$.subscribe(sessionId => {
          if (sessionId) {
            this.flightBook(sessionId);
            // if (this.stripeResponse && this.stripeResponse.url) {
            //   window.location.href = this.stripeResponse.url;
            // }
          }
        });
      },
      error => {
        console.error('Error sending data to API:', error);
      }
    );
  }
  get totalInfantTravellers(): number {
    return this.typeOfTraveller.infantOnLap + this.typeOfTraveller.infantOnSeat;
  }

 


  onPhoneNumberInput(event: any, index?: any): void {
      const input = event.target;
      let value = input.value.replace(/\D/g, ''); 
  
      const maxLength = 10;
      if (value.length > maxLength) {
          value = value.slice(0, maxLength);
      }
  
      // Initialize previous value if it doesn't exist
      if (!this.previousValues.hasOwnProperty(index)) {
          this.previousValues[index] = '';
      }
  
      // Check if the current value is shorter than the previous value, indicating a backspace
      const isDeleting = this.previousValues[index].length > value.length;
  
      if (!isDeleting) {
          // If not deleting, format the value
          const formattedValue = this.formatPhoneNumber(value);
          input.value = formattedValue;
          this.updateFormControl(index, formattedValue);
      } else {
          // If deleting, set the raw value directly
          input.value = value;
          this.updateFormControl(index, this.rawToFormattedPhoneNumber(value));
      }
  
      // Update the previous value for this index
      this.previousValues[index] = input.value;
  }
  
  formatPhoneNumber(value: string): string {
      // Format the phone number as (###) ###-####
      const formattedNumber = value.length > 6
          ? `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
          : value.length > 3
          ? `(${value.slice(0, 3)}) ${value.slice(3, 6)}`
          : value.length > 0
          ? `(${value.slice(0, 3)}`
          : value;
      return formattedNumber;
  }
  
  rawToFormattedPhoneNumber(value: string): string {
      // Convert raw phone number to formatted phone number without any formatting characters
      if (value.length === 0) {
          return '';
      } else if (value.length <= 3) {
          return `(${value}`;
      } else if (value.length <= 6) {
          return `(${value.slice(0, 3)}) ${value.slice(3, 6)}`;
      } else {
          return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      }
  }
  
  updateFormControl(index: number, value: string): void {
      const travellers = this.paymentForm.get('travellers') as FormArray;
      const travellerData = travellers.at(index) as FormGroup;
      travellerData.get('phoneNumber')?.setValue(value);
  }
  
  flightBook(sessionId: any) {

    const travellerData: any[] = [];
    let flightOffer = [];
    for (let i = 0; i < this.flightData[0].flightOffers.length; i++) {

      flightOffer.push(this.flightData[0].flightOffers[i]);
    }
    const travelerIds = this.getTravelerIdsByType(flightOffer[0].travelerPricings);
    const travellersFormArray = this.paymentForm.get('travellers')?.value;
    travellersFormArray.forEach((traveler: any, index: any) => {
      let contact = null;
      if (traveler.email && traveler.phoneNumber) {
        contact = {
          emailAddress: traveler.email,
          phones: [
            {
              deviceType: 'MOBILE',
              countryCallingCode: "34",
              number: this.PhoneNumber(traveler.phoneNumber)
            }
          ]
        };
      }
      travellerData.push({
        id: travelerIds.adults[index],
        dateOfBirth: this.formatDate(traveler.DOB),
        name: {
          firstName: traveler.firstName.toUpperCase(),
          lastName: traveler.lastName.toUpperCase()
        },
        gender: traveler.Gender.toUpperCase(),
        ...(contact && { contact }) 
      })


    });

    const childrenData = this.paymentForm.get('child')?.value;
    if(childrenData.length >0){
      childrenData.forEach((child: any, index: any) => {
        travellerData.push({
          id:  travelerIds.children[index],
          name: {
            firstName: child.firstName.toUpperCase(),
            lastName: child.lastName.toUpperCase()
          },
          gender: child.Gender.toUpperCase(),
  
        })
   
      });
    }


    const infant = this.paymentForm.get('infant')?.value;
    if(infant.length >0){

    infant.forEach((infant: any, index: any) => {

      travellerData.push({
        id: travelerIds.infants[index],
        dateOfBirth: this.formatDate(infant.DOB),
        name: {
          firstName: infant.firstName.toUpperCase(),
          lastName: infant.lastName.toUpperCase()
        },
        gender: infant.Gender.toUpperCase(),

      })

    });
  }


// Only Email and moblie number sending with sessionId
    const flightOrderData: any = {
      type: "flight-order",
      flightOffers: flightOffer,
      travelers: travellerData,
      contacts: [
        {
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "34",
              number: this.PhoneNumber(this.paymentForm.get('phoneNumber')?.value)
            }
          ],
          emailAddress: this.paymentForm.get('email')?.value
        }
      ]

    };

    this.flightService.flightBooking(flightOrderData, sessionId).subscribe((response: any) => {
      if (response.data) {
        this.isLoading = false;
        if (this.stripeResponse && this.stripeResponse.url) {
          window.location.href = this.stripeResponse.url;
        }

      }
      else {
        this.isLoading = false;
        this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
      }
    })
  }
  getTravelerIdsByType(travelerPricings:any):any{
    const adults: string[] = [];
    const children: string[] = [];
    const infants: string[] = []
    travelerPricings.forEach((traveler: { travelerType: any; travelerId: string; }) => {
      switch (traveler.travelerType) {
        case 'ADULT':
          adults.push(traveler.travelerId);
          break;
        case 'CHILD':
          children.push(traveler.travelerId);
          break;
        case 'SEATED_INFANT':
        case 'HELD_INFANT':
          infants.push(traveler.travelerId);
          break;
        default:
          break;
      }
    });

    return { adults, children, infants };

  }
  formatDate(selectedDate: any) {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  PhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, ''); // \D matches any non-digit character
  }
  getCityName(iataCode: string): string | undefined {

    const city = this.cityDetail.find((city: any) => city.iataCode === iataCode);
    return city ? city.cityName : undefined;
  }
}