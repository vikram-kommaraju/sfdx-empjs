import { LightningElement, track } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class EmpApiLWC extends LightningElement {
    @track channelName = '/event/Test__e';
    @track isSubscribeDisabled = false;
    @track isUnsubscribeDisabled = !this.isSubscribeDisabled;
    @track debugFlag = false;
    @track debugStyle = "success";
    @track debugLabel = "Enable Debug";
    @track empApiEnabled = "click button to check";
    
    subscription = {};
    messageReceived = {};
    unsubscribeResponse = {};
    errorReceived = {};

    // tracks changes to channelName text field
    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    // handles subscribe button click
    handleSubscribe() {
        // callback invoked whenever a new event message is received
        const messageCallback = function(response) {
            this.messageReceived = response;
            // response contains the payload of the new message received
        };

        // invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // response contains the subscription information on successful subscribe call
            this.subscription = response;
            this.toggleSubscribeButton(true);
        });
    }

    // handles unsubscribe button click
    handleUnsubscribe() {
        this.toggleSubscribeButton(false);

        // invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            this.unsubscribeResponse = response;
            // response is true for successful unsubscribe
        });
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
        // invoke onError empApi method
        onError(error => {
            this.errorReceived = error;
            // error contains the server-side error
        });
    }

    handleDebugFlag() {
        // invoke setDebugFlag empApi method
        this.debugFlag = !this.debugFlag;
        this.debugStyle = this.debugFlag === true ? "destructive" : "success";
        this.debugLabel = this.debugFlag === true ? "Disable Debug" : "Enable Debug";
        
        setDebugFlag({flag: this.debugFlag});
    }

    handleEmpEnabled() {
        // invoke isEmpEnabled empApi method
        isEmpEnabled().then(response => {
            this.empApiEnabled = response;
        });
    }
}