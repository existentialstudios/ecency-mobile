import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  post: {
    paddingTop: 10,
    marginBottom: 10,
    backgroundColor: '$primaryBackgroundColor',
    shadowOpacity: 0.2,
    shadowColor: '$shadowColor',
    elevation: 0.1,
    shadowOffset: {
      height: 1,
    },
  },
  commentButton: {
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  commentIcon: {
    alignSelf: 'flex-start',
    fontSize: 20,
    color: '$iconColor',
    margin: 0,
    width: 20,
    marginLeft: 25,
  },
  postBodyWrapper: {
    marginHorizontal: 9,
  },
  thumbnail: {
    margin: 0,
    alignItems: 'center',
    alignSelf: 'center',
    //height: 200,
    //width: '$deviceWidth - 16',
    borderRadius: 8,
    backgroundColor: '$primaryLightGray',
  },
  hiddenImages: {
    flexDirection: 'column',
  },
  postDescripton: {
    flexDirection: 'column',
    paddingHorizontal: 8,
    backgroundColor: '$primaryBackgroundColor',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '$primaryBlack',
  },
  summary: {
    fontSize: 16,
    color: '$primaryDarkGray',
    lineHeight: 22,
  },
  bodyFooter: {
    backgroundColor: '$primaryBackgroundColor',
    flexDirection: 'row',
    margin: 16,
  },
  bodyHeader: {
    backgroundColor: '$primaryBackgroundColor',
    flexDirection: 'row',
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 12,
    marginRight: 0,
  },
  pushPinIcon: {
    color: '$primaryRed',
    alignSelf: 'center',
    marginLeft: 8,
    marginRight: -16,
    transform: [{ rotate: '45deg' }],
  },
  leftFooterWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightFooterWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dropdownWrapper: {
    marginTop: 6,
  },
  reblogWrapper: {
    marginLeft: 6,
  },
  reblogText: {
    fontWeight: 'bold',
    color: '$primaryDarkGray',
    marginLeft: 2,
  },
  revealButton: {
    backgroundColor: '$primaryGrayBackground',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
    marginHorizontal: 0,
  },
  revealText: {
    color: '$primaryDarkText',
    textAlign: 'center',
    fontSize: 18,
  },
});
