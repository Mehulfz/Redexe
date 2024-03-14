import colors from './colors'
import env from './env'

export const defaultHeaderOption = {
  headerTitleAlign: 'center',
  gestureEnabled: false,
  headerTintColor: colors.white,
  headerStyle: {
    backgroundColor: colors.primary
  },
  headerTitleStyle: {
    fontFamily: env.fontBold,
    fontSize: 20
  },
  headerBackTitleVisible: false
}
