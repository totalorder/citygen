/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

    this.object = object;
    this.target = new THREE.Vector3( 0, 0, 0 );

    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;
    // this.invertVertical = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.look = new THREE.Vector3(1, 0, 0);

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.freeze = false;
    this.object.rotation.x = 0;
    this.object.rotation.y = 0;
    this.object.rotation.z = 0;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;
    this.throttle = 1;

    if ( this.domElement !== document ) {

        this.domElement.setAttribute( 'tabindex', -1 );

    }

    //

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;

        } else {

            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;

        }

    };

    this.onMouseDown = function ( event ) {

        if ( this.domElement !== document ) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        if ( this.activeLook ) {

            switch ( event.button ) {

                case 0: this.moveForward = true; break;
                case 2: this.moveBackward = true; break;

            }

        }

        this.mouseDragOn = true;

    };

    this.onMouseUp = function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        if ( this.activeLook ) {

            switch ( event.button ) {

                case 0: this.moveForward = false; break;
                case 2: this.moveBackward = false; break;

            }

        }

        this.mouseDragOn = false;

    };

    this.onMouseMove = function ( event ) {

        if ( this.domElement === document ) {

            this.mouseX = event.pageX - this.viewHalfX;
            this.mouseY = event.pageY - this.viewHalfY;

        } else {

            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

        }

    };

    this.onKeyDown = function ( event ) {

        //event.preventDefault();

        switch ( event.keyCode ) {

            case 38: /*up*/ this.moveForward = true; break;
//            case 87: /*W*/ this.moveForward = true; break;

            case 37: this.moveLeft = true; break;/*left*/
//            case 65: /*A*/ this.moveLeft = true; break;

            case 40: /*down*/ this.moveBackward = true; break;
//            case 83: /*S*/ this.moveBackward = true; break;

            case 39: this.moveRight = true; break; /*right*/
//            case 68: /*D*/ this.moveRight = true; break;

            case 65: /*A*/ this.panLeft = true; break;
            case 68: /*D*/ this.panRight = true; break;

            case 87: /*W*/ this.throttleUp = true; break; /*right*/

            case 82: /*R*/ this.moveUp = true; break;
            case 70: /*F*/ this.moveDown = true; break;

            case 81: /*Q*/ this.freeze = !this.freeze; break;

        }

    };

    this.onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: /*up*/ this.moveForward = false; break;
//            case 87: /*W*/ this.moveForward = false; break;

            case 37: this.moveLeft = false; break; /*left*/
//            case 65: /*A*/ this.moveLeft = false; break;

            case 40: /*down*/ this.moveBackward = false; break;
//            case 83: /*S*/ this.moveBackward = false; break;

            case 39: this.moveRight = false; break; /*right*/

            case 87: /*W*/this.throttleUp = false; break; /*right*/
//            case 68: /*D*/ this.moveRight = false; break;

            case 82: /*R*/ this.moveUp = false; break;
            case 70: /*F*/ this.moveDown = false; break;

            case 65: /*A*/ this.panLeft = false; break;
            case 68: /*D*/ this.panRight = false; break;

        }

    };

    this.update = function( delta ) {

        if ( this.freeze ) {

            return;

        }

        if ( this.heightSpeed ) {

            var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

        } else {

            this.autoSpeedFactor = 0.0;

        }

        var actualMoveSpeed = delta * this.movementSpeed;

//        if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
//        if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );
//
//        if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
//        if ( this.moveRight ) this.object.translateX( actualMoveSpeed );
//
//        if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
//        if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

        var actualLookSpeed = delta * this.lookSpeed;

        if ( !this.activeLook ) {

            actualLookSpeed = 0;

        }

        var verticalLookRatio = 1;

        if ( this.constrainVertical ) {

            verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

        }

        this.lon += this.mouseX * actualLookSpeed;
        if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        this.phi = THREE.Math.degToRad( 90 - this.lat );

        this.theta = THREE.Math.degToRad( this.lon );

        if ( this.constrainVertical ) {

            this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

        }

        var targetPosition = this.target,
            position = this.object.position;

        targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
        targetPosition.y = position.y + 100 * Math.cos( this.phi );
        targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

        var rotationSpeed = 0.7;
        if (this.moveForward) {
            this.object.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotationSpeed * delta);
//            this.look.x += rotationSpeed * delta;
        } else if (this.moveBackward) {
            this.object.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotationSpeed * delta);
        }

        if (this.moveLeft) {
            this.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotationSpeed * delta);
//            this.look.z += rotationSpeed * delta;
        } else if (this.moveRight) {
            this.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotationSpeed * delta);
//            this.look.z -= rotationSpeed * delta;
        }

        if (this.panLeft) {
            this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationSpeed * delta * 0.5);
//            this.look.z += rotationSpeed * delta;
        } else if (this.panRight) {
            this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotationSpeed * delta * 0.5);
//            this.look.z -= rotationSpeed * delta;
        }

        var throttleSpeed = 20;
        if (this.throttleUp) {
            this.throttle += throttleSpeed * delta;
            if (this.throttle > 50) {
                this.throttle = 50;
            }
        } else {
            this.throttle -= throttleSpeed * delta;
            if (this.throttle < 0) {
                this.throttle = 0;
            }
        }
        console.log(this.throttle);

        this.object.translateOnAxis(new THREE.Vector3(0, 1, 0), this.throttle * delta);
        this.object.position.y -= delta * 10;

        targetPosition.x = position.x + Math.sin( this.look.x ) * Math.cos( this.look.y );
        targetPosition.y = position.y + Math.cos( this.look.x );
        targetPosition.z = position.z + Math.sin( this.look.x ) * Math.sin( this.look.y );

//          this.object.rotation.x = (this.look.x / 360) * 2*Math.PI;
//          this.object.rotation.y = (this.look.y / 360) * 2*Math.PI;
//          this.object.rotation.z = (this.look.z / 360) * 2*Math.PI;
//        this.object.setRotationFromEuler(new THREE.Vector3(90, 0, 0));
//        this.object.lookAt( targetPosition );
//        this.object.setRotationFromAxisAngle(new THREE.Vector3( 90, 90, 90 ));

    };


    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

//    this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
//    this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
//    this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
    this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
    this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

    function bind( scope, fn ) {

        return function () {

            fn.apply( scope, arguments );

        };

    };

    this.handleResize();

};
