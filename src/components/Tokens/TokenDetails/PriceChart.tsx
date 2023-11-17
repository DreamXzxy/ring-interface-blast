import { ArrowChangeDown } from 'components/Icons/ArrowChangeDown'
import { ArrowChangeUp } from 'components/Icons/ArrowChangeUp'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'
import styled from 'styled-components'

const StyledUpArrow = styled(ArrowChangeUp)`
  color: ${({ theme }) => theme.success};
`
const StyledDownArrow = styled(ArrowChangeDown)`
  color: ${({ theme }) => theme.critical};
`

const DefaultUpArrow = styled(ArrowUpRight)`
  color: ${({ theme }) => theme.neutral3};
`
const DefaultDownArrow = styled(ArrowDownRight)`
  color: ${({ theme }) => theme.neutral3};
`

export function getDeltaArrow(delta: number | null | undefined, iconSize = 16, styled = true) {
  // Null-check not including zero
  if (delta === null || delta === undefined) {
    return null
  } else if (Math.sign(delta) < 0) {
    return styled ? (
      <StyledDownArrow width={iconSize} height={iconSize} key="arrow-down" aria-label="down" />
    ) : (
      <DefaultDownArrow size={iconSize} key="arrow-down" aria-label="down" />
    )
  }
  return styled ? (
    <StyledUpArrow width={iconSize} height={iconSize} key="arrow-up" aria-label="up" />
  ) : (
    <DefaultUpArrow size={iconSize} key="arrow-up" aria-label="up" />
  )
}

export function formatDelta(delta: number | null | undefined) {
  // Null-check not including zero
  if (delta === null || delta === undefined || delta === Infinity || isNaN(delta)) {
    return '-'
  }
  const formattedDelta = Math.abs(delta).toFixed(2) + '%'
  return formattedDelta
}

export const DeltaText = styled.span<{ delta?: number }>`
  color: ${({ theme, delta }) =>
    delta !== undefined ? (Math.sign(delta) < 0 ? theme.critical : theme.success) : theme.neutral1};
`

export const ArrowCell = styled.div`
  padding-right: 3px;
  display: flex;
`
