import React from 'react';
import GenerateContractData from '../components/SolidityUtils/GenerateContractData';
import GenerateDigest from '../components/SolidityUtils/GenerateDigest';


class SocialRecoveryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: '',
      new_owner: '',
    };

    this.handleChangeWallet = this.handleChangeWallet.bind(this);
    this.handleChangeNewOwner = this.handleChangeNewOwner.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleParent = props.handler
  }

  handleChangeWallet(event) {
    this.setState({ wallet: event.target.value });
  }
  handleChangeNewOwner(event) {
    this.setState({ new_owner: event.target.value });
  }

  handleSubmit(event) {
    const url_for_guardians = new URL("http://localhost:3000/accept_recovery");

    url_for_guardians.searchParams.append("wallet", this.state.wallet);
    url_for_guardians.searchParams.append("new_owner", this.state.new_owner);

    let nonce = this.generateNonce()
    url_for_guardians.searchParams.append("nonce", nonce);

    this.handleParent("" + url_for_guardians)
    event.preventDefault();
  }

  generateNonce() {
    const defaultRequest = {
      wallet: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      ownerAddr: '0xFc32402667182d11B29fab5c5e323e80483e7800',
      newOwner: '0x25A71a07cecf1753ee65b00E0a3AAEf7e0F51c0F',
      prevOwner: '0x0000000000000000000000000000000000000001',
      recoveryModule: { address: '0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f' },
    }

    return GenerateDigest(defaultRequest)
    // return "flvkj"
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Адрес кошелька к оторому нужно восстановить пароль:<br></br>
          <input type="text" value={this.state.wallet} onChange={this.handleChangeWallet} />
        </label>
        <br></br>
        <label>
          Адрес нового владельца кошелька:<br></br>
          <input type="text" value={this.state.new_owner} onChange={this.handleChangeNewOwner} />
        </label>
        <br></br>
        <input type="submit" value="Отправить" />
      </form>
    );
  }
}

class RequestToGuards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.url_for_guardians = props.url_for_guardians


    this.handleChangeGuardian1 = this.handleChangeGuardian1.bind(this);
    this.handleChangeGuardian2 = this.handleChangeGuardian2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeGuardian1(event) {
    this.setState({ guardian1: event.target.value });
  }
  handleChangeGuardian2(event) {
    this.setState({ guardian2: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <h2>Перешлите ссылку вашим опекунам, чтобы они подтвердили операцию:</h2>
        <br />
        <a href="url">{this.url_for_guardians}</a>
        <br />
        <h2>Введите open_id JWT токены с нужной подписью ваших опекунов</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            OpenId первого опекуна:<br></br>
            <input type="text" value={this.state.guardian1} onChange={this.handleChangeGuardian1} />
          </label>
          <br></br>
          <label>
          OpenId второго опекуна:<br></br>
            <input type="text" value={this.state.guardian2} onChange={this.handleChangeGuardian2} />
          </label>
          <br></br>
          <input type="submit" value="Сформировать транзакцию и подписать ее" />
        </form>
      </div>
    );
  }
}

class SocialRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete_form: false,
      url_for_guardians: '',
    };
    this.StopRecoverForm = this.StopRecoverForm.bind(this)
  }

  StopRecoverForm(prop_url) {
    this.setState({
      url_for_guardians: prop_url,
      complete_form: true
    })
  }


  render() {
    let render_comp
    if (this.state.complete_form) {
      render_comp = <RequestToGuards url_for_guardians={this.state.url_for_guardians} />
    } else {
      render_comp = <SocialRecoveryForm handler={this.StopRecoverForm} />
    }
    return (
      <div>
        <h1>Welcome to SocialRecovery</h1>
        {render_comp}
      </div>
    );
  }
}

export default SocialRecovery;
