import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppImg } from 'src/app/model/appImg';
import { SupabaseService } from 'src/app/services/supabase.service';
import { COMMA, ENTER, I, SPACE } from '@angular/cdk/keycodes';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('largeImageOverlay') largeImageOverlay: ElementRef;

  loadedImgs: AppImg[] = [];

  selectedFile: File;
  selectedTags: string[] = [];

  /**
   * The data of the img that will be uploaded as a string.
   */
  selectedFileUrl: string;

  /**
   * Used to toggle mat-spinner objects while loading.
   */
  loadingIds: boolean = true;
  loadingIndividualIds: boolean = false;
  uploadingImg: boolean = false;

  largeImgOverlayData: string;

  /**
   * These keys create a new tag when hit.
   */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  constructor(
    private supabaseService: SupabaseService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadAppImgIds();
  }

  /**
   * First loads a list of ids of all AppImg objects in the db.
   * Then the individual AppImgs are loaded in parallel.
   */
  loadAppImgIds() {
    this.loadingIds = true;
    this.supabaseService.getAllAppImgIds().subscribe(response => {
      if (response === null) {
        this.snackbar.open('Bilder konnten nicht geladen werden')
      } else {
        response.forEach(element => {
          this.loadedImgs.push(element)
        });

        this.loadingIds = false;

        if (this.loadedImgs.length > 0) {
          this.loadingIndividualIds = true;
        }
        this.loadedImgs.forEach(appImg => {

          this.supabaseService.getAppImgById(appImg.id).subscribe(response => {
            appImg.data = response[0].data;

            appImg.tags = this.CSVToString(response[0].tags);

            appImg.timestamp = this.formatDateTime(response[0].timestamp)


          }, error => {
            this.snackbar.open('Ein Bild konnte nicht geladen werden: ', error)
          })
        });
      }

      this.loadingIndividualIds = false;

    }, error => {
      this.loadingIndividualIds = false;
      this.snackbar.open('Bilder konnten nicht geladen werden: ', error)
    })
  }

  CSVToString(tagsAsString: string): string[] {
    let tagsAsArray: string[] = tagsAsString.split(',');

    if (tagsAsArray[0] === '') {
      tagsAsArray = null;
    }

    return tagsAsArray;
  }

  uploadImg($event: any) {
    var reader = new FileReader();
    if ($event.target.files && $event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.uploadingImg = true;
        this.selectedFileUrl = event.target.result;
        this.selectedFile = $event.target.files[0];
        this.supabaseService.postAppImg(this.selectedTags, this.selectedFileUrl).subscribe(response => {
          response[0].tags = this.CSVToString(response[0].tags)
          this.loadedImgs.push(response[0])
          this.uploadingImg = false;
          this.snackbar.open('Bild wurde erfolgreich hochgeladen!')
          this.selectedFile = null;
          this.selectedFileUrl = null
        }, error => {
          this.snackbar.open('Bild konnte nicht hochgeladen werden: ', error)
          this.uploadingImg = false;
          this.selectedFile = null;
          this.selectedFileUrl = null
        })
      }
      reader.readAsDataURL($event.target.files[0]);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.selectedTags.push(input.value.toLowerCase());
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tempTag): void {
    const index = this.selectedTags.indexOf(tempTag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  showLargeImageOverlay(imgData: string) {
    this.largeImgOverlayData = imgData;
    this.largeImageOverlay.nativeElement.classList.add("visible")
  }

  closeLargeImgOverlay() {
    this.largeImageOverlay.nativeElement.classList.remove("visible")
  }

  formatDateTime(date: Date): string {
    if (!date) {
      return '';
    }

    return moment(date).format('HH:mm:ss DD.MM.yyyy');
  }
}
