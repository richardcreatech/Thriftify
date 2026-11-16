import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 44,
    height: 84,
  },

  brandContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 16,
  },

  brandName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  tagline: {
    color: '#D8C9DE',
    fontSize: 13,
    letterSpacing: 0.3,
    marginTop: 4,
  },
});

export default styles;
