import React, { Component } from 'react'
import { getVersaoApi } from '../../../services/Core.service'

export class Versao extends Component {
  constructor(props) {
    super(props)

    this.state = {
      versaoApi: '',
      versaoFront: '',
    }
  }
  async componentDidMount() {
    const versaoApi = await getVersaoApi()

    const pjson = require('../../../../package.json')
    const versaoFront = pjson.version

    this.setState({ versaoApi, versaoFront })
  }
  render() {
    return (
      <span>{`${this.state.versaoFront} (API:${this.state.versaoApi})`}</span>
    )
  }
}
