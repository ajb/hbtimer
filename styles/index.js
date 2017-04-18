import { StyleSheet } from 'react-native'

export const colors = {
  orange: '#ff9600',
  lighterGray: '#eee',
  lightGray: '#ccc',
  gray: '#999',
  darkGray: '#666',
  darkerGray: '#444',
  darkestGray: '#222',
  white: '#fff',
  black: '#000',
  deleteRed: '#ff3824'
}

export const sizes = {
  fontNormal: 17.5
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
  },
  startBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    padding: 1,
    backgroundColor: colors.black,
    borderTopWidth: 1,
    borderTopColor: colors.darkerGray,
    paddingLeft: 20,
    paddingRight: 20
  },
  circleButton: {
    height: 80,
    width: 80,
    borderRadius: 50
  },
  circleButtonInner: {
    borderColor: colors.black,
    borderWidth: 1,
    height: 76,
    width: 76,
    marginTop: 2,
    marginLeft: 2,
    borderRadius: 76/2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleButtonText: {
    fontSize: 16,
    backgroundColor: 'transparent'
  },
  listItem: {
    height: 50,
    paddingRight: 15,
    marginLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editableListItem: {
    paddingRight: 46,
    paddingLeft: 36,
    justifyContent: 'flex-start'
  },
  listItemText: {
    fontSize: sizes.fontNormal,
    color: colors.lightGray
  },
  listItemWeight: {
    fontSize: sizes.fontNormal,
    color: colors.gray,
    marginLeft: 10
  },
  editableListItemDelete: {
    position: 'absolute',
    left: 0
  },
  editableListItemText: {
    fontSize: sizes.fontNormal,
    flex: 1,
    color: colors.lightGray
  },
  editableListItemWeight: {
    textAlign: 'right',
    minWidth: 60,
    fontSize: sizes.fontNormal,
    color: colors.gray,
    marginLeft: 10,
    alignContent: 'flex-end'
  },
  editableListItemReorder: {
    position: 'absolute',
    right: 10
  }
})

export default styles
