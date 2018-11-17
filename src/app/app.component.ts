import { Component } from '@angular/core';
import { _getComponentHostLElementNode } from '@angular/core/src/render3/instructions';
declare var StellarSdk: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'xlm-relay-switch';

  sendingPayment = false;

  constructor() {
  }
  toggleFL() {
    console.log('toggle fl');
    const secret = '<your private key>';
    const from = '<from address>';
    const to = '<to address>';

    StellarSdk.Network.usePublicNetwork();

    this.sendingPayment = true;
    const server = new StellarSdk.Server('https://horizon.stellar.org');
    server
      .loadAccount(from)
      .then(account => {
        const tx = new StellarSdk.TransactionBuilder(account)
          .addMemo(StellarSdk.Memo.text('switchon'))
          .addOperation(StellarSdk.Operation.payment({
            destination: to,
            asset: StellarSdk.Asset.native(),
            amount: '0.001',
          }))
          .build();

        tx.sign(StellarSdk.Keypair.fromSecret(secret));

        return server.submitTransaction(tx);
      })
      .then((txResult) => {
        console.log('payment send: ' + txResult.hash);
        this.sendingPayment = false;
      })
      .catch((err) => {
        console.log('payment error');
        console.log(err);
        this.sendingPayment = false;
      });
  }
}
