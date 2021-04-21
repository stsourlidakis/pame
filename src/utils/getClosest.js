const { default: didYouMean, ThresholdTypeEnums } = require('didyoumean2');

module.exports = function getClosest(input, matchList, maxDistance = 1) {
	return didYouMean(input, matchList, {
		threshold: maxDistance,
		thresholdType: ThresholdTypeEnums.EDIT_DISTANCE,
	});
};
