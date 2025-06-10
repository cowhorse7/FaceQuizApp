import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { DecksService } from '../../services/decks/decks.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NgModel, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-deck-modal',
  imports: [MatDialogModule, FormsModule,MatInputModule],
  templateUrl: './create-deck-modal.component.html',
  styleUrl: './create-deck-modal.component.scss'
})
export class CreateDeckModalComponent {
  readonly decksService = inject(DecksService);
  readonly dialogRef = inject(MatDialogRef<CreateDeckModalComponent>);
  // readonly deckId: number | undefined = inject(MAT_DIALOG_DATA);

  readonly nameModel = viewChild.required('nameInput', {read: NgModel});

  private closeOnCreate= effect(()=> {
    if(this.createDeckRequest.statusCode() === 200){
      this.dialogRef.close(this.createDeckRequest.value()?.id);
    }
  });

  private convertConflictError = effect(()=> {
    if(this.createDeckRequest.statusCode() === 409){
      this.nameModel().control?.setErrors({conflict: true});
    }
  });
  
  name = signal('');
  description = signal('');
  createDeckRequest = this.decksService.createDeck(this.name, this.description);

  canSendRequest = computed(()=> 
    this.name().trim().length &&
    !this.createDeckRequest.isLoading(),
  );
  sendRequest() {
    if(!this.canSendRequest()) return;
    else this.createDeckRequest.refresh();
  }

}
