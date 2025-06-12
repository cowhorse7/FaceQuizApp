import { Component, computed, effect, inject, linkedSignal, viewChild } from '@angular/core';
import { DecksService } from '../../services/decks/decks.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NgModel, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-deck',
  imports: [MatDialogModule, FormsModule,MatInputModule],
  templateUrl: './edit-deck.component.html',
  styleUrl: './edit-deck.component.scss'
})
export class EditDeckComponent {
  readonly decksService = inject(DecksService);
  readonly dialogRef = inject(MatDialogRef<EditDeckComponent>);
  readonly deckId: number = inject(MAT_DIALOG_DATA);

  readonly nameModel = viewChild.required('nameInput', {read: NgModel});

  private closeOnUpdate= effect(()=> {
    if(this.updateDeckRequest.statusCode() === 200){
      this.dialogRef.close(this.updateDeckRequest.value()?.id);
    }
  });

  private convertConflictError = effect(()=> {
    if(this.updateDeckRequest.statusCode() === 409){
      this.nameModel().control?.setErrors({conflict: true});
    }
  });

  getDeckRequest = this.decksService.getDeck(this.deckId);
  
  name = linkedSignal(() => this.getDeckRequest.value()?.name ?? ''); //FIXME: I want these values to display the current value... what am I missing? I think it's to do with the
  description = linkedSignal(() => this.getDeckRequest.value()?.description ?? '');
  updateDeckRequest = this.decksService.updateDeck(this.name, this.description, this.deckId);

  canSendRequest = computed(()=> 
    this.name().trim().length &&
    !this.getDeckRequest.isLoading() &&
    !this.updateDeckRequest.isLoading(),
  );
  sendRequest() {
    if(!this.canSendRequest()) return;
    else this.updateDeckRequest.refresh();
  }
}
