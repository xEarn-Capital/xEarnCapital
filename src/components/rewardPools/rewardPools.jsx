import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { withNamespaces } from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#000",
    },
    padding: '12px',
    backgroundColor: "#000",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  title: {
    padding: '12px',
    textAlign: 'center'
  },
  subtitle: {
    padding: '12px',
    borderRadius: '0.75rem',
    textAlign: 'center'
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  rewardPools: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '20px',
    flexWrap: 'wrap'
  },
  rewardPoolContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    margin: '20px',
    background: colors.white,
    minHeight: '300px',
    minWidth: '200px',
  },
  text: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
  },
  poolName: {
    paddingBottom: '20px',
    color: colors.text
  },
  poolName2: {
    color: colors.text
  },
  tokensList: {
    color: colors.darkGray,
    paddingBottom: '20px',
  },
  tokensList2: {
    color: colors.darkGray,
  },
  poolWebsite: {
    color: colors.darkGray,
    paddingBottom: '20px',
    textDecoration: 'none'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class RewardPools extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const rewardPools = store.getStore('rewardPools')

    this.state = {
      rewardPools: rewardPools,
      loading: !(account && rewardPools),
      account: account,
    }
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  componentWillMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({ rewardPools: rewardPools })
  }

  configureReturned = () => {
    this.setState({ loading: false })
  }

  closeAlert = () => {
    this.setState({open: false})
  }

   forHumans = (seconds) =>  {
    const levels = [
      [Math.floor(seconds / 31536000), 'years'],
      [Math.floor((seconds % 31536000) / 86400), 'days'],
      [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
      [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
      [Math.floor((((seconds % 31536000) % 86400) % 3600) % 60), 'seconds'],
    ]
    let returntext = ''
  
    for (var i = 0, max = levels.length; i < max; i++) {
      if (levels[i][0] === 0) continue
      returntext +=
        ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1])
    }
  
    return returntext.trim()
  }

  render() {
    const { classes, t, i18n } = this.props;
    const {
      value,
      account,
      loading,
      modalOpen,
      open
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <Typography variant="h2" className={ classes.title }>
          
        </Typography>
       
        <div className={ classes.intro }>
          <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
            <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>{t('RewardPools.Wallet')}</Typography>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
            <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
          </Card>
        </div>
        <div className={ classes.rewardPools }>
          <Typography variant={ 'h3'} className={ classes.text } noWrap>{t('RewardPools.WhichTokens')}</Typography>
          {
            this.renderRewards()
          }
        </div>
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderRewards = () => {
    const { rewardPools } = this.state

    return rewardPools.map((rewardPool) => {
      return this.renderRewardPool(rewardPool)
    })
  }

  renderRewardPool = (rewardPool) => {

    const { classes, t } = this.props

    let tokensList = rewardPool.tokens.map((rp) => { return rp.symbol }).join(', ')
    if(tokensList.length > 2) {
      tokensList = (tokensList + ' ...')
    }

    return (<div className={ classes.rewardPoolContainer} key={ rewardPool.id } >
      <Typography variant='h3' className={ classes.poolName }>{ rewardPool.id }</Typography>
      <Typography variant='h5' className={ classes.poolWebsite }><a href={ rewardPool.link } target="_blank">{ rewardPool.website }</a></Typography>
      <Typography varian='h4' className={ classes.tokensList } align='center'>
        { rewardPool.tokens.length > 0 && `${t('RewardPools.SupportedTokens')}: ` + tokensList  }
        { rewardPool.tokens.length == 0 && t('RewardPools.NoSupportedTokens')  }
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={ () => { if(rewardPool.tokens.length > 0) { this.navigateStake(rewardPool) } } }
      >
        <Typography variant={ 'h4'}>{t('RewardPools.Open')}</Typography> 
       
      </Button>
      <Typography varian='h4' className={ classes.tokensList2 } align='center'>Total rewards claimed: </Typography>
      <Typography style={{marginBottom:"10px"}} variant='h4' className={ classes.poolName2 }>{ rewardPool.tokens[0].rewardsClaimed } XRN</Typography>
    </div>)
  }

  navigateStake = (rewardPool) => {
    store.setStore({ currentPool: rewardPool })

    this.props.history.push('/stake')
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(RewardPools)));
