import { StyleSheet } from 'react-native'

export const colors = {
  orange: '#ff9600',
  darkGray: '#666',
  darkestGray: '#222',
  white: '#fff'
}

let styles = StyleSheet.create({
  app: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  navbar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.darkestGray
  },
  navbarTitle: {
    color: colors.white
  },
  navbarPlus: {
    marginTop: 6,
    marginRight: 8
  }
})

export default styles
