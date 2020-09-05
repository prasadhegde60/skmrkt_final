import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss'],
})
export class TermsAndConditionComponent implements OnInit {
  isChecked = false;

  constructor(
    public dialogRef: MatDialogRef<TermsAndConditionComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {}

  onUnderstoodClick(): void{
    this.dialogRef.close(true);
  }

  onDisagreeClick(): void{
    this.dialogRef.close(false);
  }

}
