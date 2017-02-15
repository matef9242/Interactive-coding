
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(EventAggregator, DialogController)
export class Dialog {

  constructor(event, controller) {
    this.event = event;
    this.controller = controller;
    this.functionObject;
    this.param;
    this.page = 'functionParamters';
    this.mainMap;
    this.subscribe();
  }
  activate(payload) {
    this.mainMap = payload.mainMap;
    this.functionObject = this.mainMap.get(payload.functionName);
    if (this.functionObject.status === 'tracked') {
      this.page = 'testCasesResult';
    }
    this.testCases = this.functionObject.testCases;
  }
  createTests() {
    this.functionObject.status = 'underTesting';
    this.event.publish('onTestCreateRequest', {mainMap: this.mainMap, functionName: this.functionObject.name});
  }
  constructObjectLiteral(param) {
    this.param = param;
    this.page = 'ObjectLiteral';
  }
  saveTests() {
    this.functionObject.status = 'tracked';
    this.event.publish('onTraverseEnds', {mainMap: this.mainMap});
    this.controller.cancel();
  }
  reset() {
    this.functionObject.status = 'untracked';
    this.event.publish('onRefershRequest');
    this.controller.cancel();
  }
  saveObjectLiteral() {
    this.page = 'functionParamters';
  }
  cancelObjectLiteral(index) {
    this.param.properties = [];
    this.page = 'functionParamters';
  }
  warning(index) {
    this.testCases[index].status = 'warning';
  }
  addProperty() {
    this.param.properties.push({name: '', selectedType: ''});
  }
  removeProperty(index) {
    this.param.properties.splice(index, 1);
  }
  subscribe() {
    this.event.subscribe('onTestReady', payload => {
      this.functionObject = payload.mainMap.get(payload.functionName);
      this.page = 'ConfirmTestCases';
    });
  }
}
