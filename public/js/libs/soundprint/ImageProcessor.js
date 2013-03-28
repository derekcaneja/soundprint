var ImageProcessor = function(options) {

	// Check for options and give blank JSON if none
	options = (options) ? options : {};

	// Defaults
}

ImageProcessor.prototype.getDetectedObjects = function(canvasID) {
	var canvas = document.getElementById(canvasID);
	var context = canvas.getContext('2d');

	// $(canvas).objectdetect('all', { classifier: objectdetect.frontalface }, function(faces) {
	// 	for (var i = 0; i < faces.length; i++) {
	// 		//var rows = imageProcessor.getEffectedRows(canvas, faces[i], toneMatrix1.column);
	// 		//imageProcessor.drawDetectedObject(canvas, faces[i]);
	// 	}
	// });
}

ImageProcessor.prototype.drawDetectedObject = function(canvas, object) {
	var context = canvas.getContext('2d');

	context.beginPath();
	context.rect(object[0], object[1], object[2], object[3]);
	context.lineWidth = 3;
	context.strokeStyle = 'rgba(255, 255, 255, 1)';
	context.stroke();
	context.closePath();
}

ImageProcessor.prototype.getEffectedRows = function(canvas, object, column) {
	var rows = new Array();

	var objectX = object[0];
	var objectY = object[1];
	var objectLimitX = object[0] + object[2];
	var objectLimitY = object[1] + object[3];
	var x = (column % 12) * (canvas.width / 12);
	var limitX = x + (canvas.width / 12);

	for(var row = 0; row < 12; row++) {
		var y = row * (canvas.height / 12);
		var limitY = y + (canvas.height / 12);

		if(x < objectX && limitX > objectX) {
			if(y < objectY && limitY > objectY) rows.push(row);
			else if (y < objectLimitY && limitY > objectLimitY) rows.push(row);
			else if (y > objectY && limitY < objectLimitY) rows.push(row);
		} else if (x < objectLimitX && limitX > objectLimitX) {
			if(y < objectY && limitY > objectY) rows.push(row);
			else if (y < objectLimitY && limitY > objectLimitY) rows.push(row);
			else if (y > objectY && limitY < objectLimitY) rows.push(row);
		} else if (x > objectX && limitX < objectLimitX) {
			if(y < objectY && limitY > objectY) rows.push(row);
			else if (y < objectLimitY && limitY > objectLimitY) rows.push(row);
			else if (y > objectY && limitY < objectLimitY) rows.push(row);
		}
	}

    return rows;
}