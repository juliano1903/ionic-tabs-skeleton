import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-time-table-modal',
  templateUrl: './time-table-modal.page.html',
  styleUrls: ['./time-table-modal.page.scss']
})
export class TimeTableModalPage implements OnInit {
  modalTitle: string;
  modelId: number;
  startDate: Date;
  endDate: Date;

  constructor(private modalController: ModalController, private navParams: NavParams) {}

  ngOnInit() {
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
    this.startDate = this.navParams.data.startDate;
    this.endDate = this.navParams.data.endDate;
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }
}
