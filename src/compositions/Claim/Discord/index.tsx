import { useEffect, useState } from 'react'
import { DiscordLogo } from 'src/assets/svgs'
import { CiclesLoading } from 'src/components/Loading'
import {
  FullScreenContainer,
  initializeDiscordParticles,
  Particles,
} from 'src/components/Particles'
import { useWalletModal } from 'src/components/WalletModal'
import { discord, white } from 'src/styles/colors'
import { fontWeightBold, fontWeightRegular } from 'src/styles/font'
import { flexCenter } from 'src/styles/mixins'
import styled, { css } from 'styled-components'
import { Container } from 'tsparticles'

type Status = 'connecting' | 'verifying' | 'failed' | 'succeeded'

export const Discord = () => {
  const { open } = useWalletModal()
  const [particles, setParticles] = useState<Container>()
  const [status, setStatus] = useState<Status>('connecting')
  useEffect(() => {
    open({ theme: 'discord' }, { styles: discordModalStyle, inescapable: true })
    initializeDiscordParticles().then((particles) => setParticles(particles))
  }, [])
  useEffect(() => {
    if (!particles) return
    if (status === 'connecting') {
      particles.options.particles.move.direction = 'none'
      particles.options.particles.move.speed = 6
      particles.refresh()
    }
    if (status === 'verifying') {
      particles.options.particles.move.direction = 'none'
      particles.options.particles.move.speed = 8
      particles.refresh()
    }
    if (status === 'succeeded') {
      particles.options.particles.move.direction = 'top'
      particles.options.particles.move.speed = 12
      particles.refresh()
    }
    if (status === 'failed') {
      particles.options.particles.move.direction = 'bottom'
      particles.options.particles.move.speed = 6
      particles.refresh()
    }
  }, [status])
  return (
    <>
      <Main>
        <FullScreenContainer>
          <Particles type="discord" />
        </FullScreenContainer>
        <Content>
          {status === 'connecting' && (
            <button onClick={() => setStatus('verifying')}>
              <DiscordLogo />
            </button>
          )}
          {status === 'verifying' && (
            <>
              <button onClick={() => setStatus('succeeded')}>
                <h2>Verifying now...</h2>
              </button>
              <p>It may take a few minutes to verify.</p>
              <CiclesLoading />
            </>
          )}
          {status === 'succeeded' && (
            <button onClick={() => setStatus('failed')}>
              <h2>Verification success!</h2>
            </button>
          )}
          {status === 'failed' && (
            <>
              <button onClick={() => setStatus('connecting')}>
                <h2>Verification failed.</h2>
              </button>
              <p>
                Your verification has failed. Do you want to verify again with
                another wallet?
              </p>
            </>
          )}
        </Content>
      </Main>
    </>
  )
}

const discordModalStyle = css`
  background: ${discord};
  color: ${white};
`

const Content = styled.div`
  position: relative;
  ${flexCenter};
  flex-direction: column;
  color: ${white};
  text-align: center;
  h2 {
    font-size: 64px;
    font-weight: ${fontWeightBold};
    letter-spacing: -0.04em;
    margin-bottom: 64px;
  }
  p {
    font-size: 18px;
    font-weight: ${fontWeightRegular};
  }
  ${CiclesLoading} {
    margin-top: 64px;
  }
`

const Main = styled.main`
  position: relative;
  background: ${discord};
  ${flexCenter};
`
