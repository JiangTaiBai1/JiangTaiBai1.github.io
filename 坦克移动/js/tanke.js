class Tank {
    /**
     * 坦克类的构造函数，用于初始化坦克实例。
     * 
     * @param {HTMLElement} element - 表示坦克的 HTML 元素。
     */
    constructor(element) {
        // 保存坦克的 HTML 元素到实例属性中
        this.element = element;
        // 初始化坦克的初始 x 坐标
        this.x = 50;
        // 初始化坦克的初始 y 坐标，将其置于窗口垂直方向的中间位置
        this.y = window.innerHeight / 2;
        // 初始化坦克的移动速度
        this.speed = 2;
        // 保存坦克的基础速度，用于恢复正常速度
        this.baseSpeed = 2;
        // 保存坦克的加速后的速度
        this.boostSpeed = 4;
        // 初始化坦克的旋转角度，初始为 0 度
        this.rotation = 0;
        // 初始化一个数组，用于存储坦克发射的所有子弹对象
        this.bullets = [];
        // 标记空格键是否被按下，初始为 false
        this.isSpacePressed = false;
        // 存储子弹发射的定时器 ID，初始为 null
        this.bulletInterval = null;

        // 调用更新位置的方法，根据初始坐标和旋转角度设置坦克的位置
        this.updatePosition();
    }

    /**
     * 更新坦克元素在页面上的位置和旋转角度。
     * 该方法会根据坦克实例的 x、y 坐标和旋转角度，
     * 设置坦克元素的 `left`、`top` 样式属性以及 `transform` 样式属性，
     * 从而将坦克元素移动到对应的位置并进行旋转。
     */
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.rotation}deg)`;
    }

    /**
     * 让坦克向前移动。
     * 该方法会根据坦克当前的旋转角度和移动速度，计算坦克向前移动后的新坐标，
     * 并调用 `checkBoundaries` 方法检查新坐标是否在游戏窗口边界内，若在边界内则更新坦克位置。
     */
    moveForward() {
        // 将坦克的旋转角度从度转换为弧度，以便进行三角函数计算
        const rad = this.rotation * Math.PI / 180;
        const newX = this.x + Math.sin(rad) * this.speed;
        const newY = this.y - Math.cos(rad) * this.speed;
        // 调用检查边界的方法，确保坦克不会移出游戏窗口
        this.checkBoundaries(newX, newY);
    }

    moveBackward() {
        const rad = this.rotation * Math.PI / 180;
        const newX = this.x - Math.sin(rad) * this.speed;
        const newY = this.y + Math.cos(rad) * this.speed;
        this.checkBoundaries(newX, newY);
    }

    checkBoundaries(newX, newY) {
        const tankWidth = 60;
        const tankHeight = 60;
        
        if (newX >= 0 && newX <= window.innerWidth - tankWidth) {
            this.x = newX;
        }
        if (newY >= 0 && newY <= window.innerHeight - tankHeight) {
            this.y = newY;
        }
        this.updatePosition();
    }

    rotateLeft() {
        this.rotation -= 5;
        this.updatePosition();
    }

    rotateRight() {
        this.rotation += 5;
        this.updatePosition();
    }

    /**
     * 坦克发射子弹的方法。
     * 该方法会创建一个新的子弹元素，初始化子弹的属性，并将其添加到游戏容器中。
     * 然后将子弹对象添加到坦克的子弹数组中，并调用 `updateBulletPosition` 方法更新子弹位置。
     */
    fireBullet() {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        document.getElementById('game-container').appendChild(bullet);

        // 将坦克的旋转角度从度转换为弧度，以便后续计算
        const rad = this.rotation * Math.PI / 180;
        // 初始化子弹对象，包含子弹元素、初始坐标、速度和方向
        const bulletObj = {
            element: bullet,
            x: this.x + 30,
            y: this.y + 30,
            speed: 8,
            direction: this.rotation
        };

        this.bullets.push(bulletObj);
        // 调用更新子弹位置的方法，开始子弹的移动动画
        this.updateBulletPosition(bulletObj);
    }

    /**
     * 更新子弹的位置并进行动画处理。
     * 该方法会不断更新子弹的坐标，使其在屏幕上移动。
     * 当子弹超出屏幕边界时，会移除子弹元素并从子弹数组中删除该子弹。
     * 
     * @param {Object} bullet - 表示要更新位置的子弹对象，包含元素、坐标、速度和方向等属性。
     */
    updateBulletPosition(bullet) {
        // 定义一个递归的动画函数，用于更新子弹位置
        const animate = () => {
            // 将子弹的方向角度转换为弧度，以便进行三角函数计算
            const rad = bullet.direction * Math.PI / 180;
            // 根据子弹的方向和速度更新子弹的 x 坐标
            bullet.x += Math.sin(rad) * bullet.speed;
            // 根据子弹的方向和速度更新子弹的 y 坐标
            bullet.y -= Math.cos(rad) * bullet.speed;
            
            // 检查子弹是否超出屏幕边界
            if (bullet.x < -20 || bullet.x > window.innerWidth || 
                bullet.y < -20 || bullet.y > window.innerHeight) {
                // 若超出边界，移除子弹的 HTML 元素
                bullet.element.remove();
                // 从坦克的子弹数组中过滤掉该子弹
                this.bullets = this.bullets.filter(b => b !== bullet);
                // 超出边界后停止递归调用
                return;
            }

            // 根据子弹的方向旋转子弹元素
            bullet.element.style.transform = `rotate(${bullet.direction}deg)`;
            // 根据更新后的 x 坐标设置子弹元素的左偏移量
            bullet.element.style.left = `${bullet.x}px`;
            // 根据更新后的 y 坐标设置子弹元素的上偏移量
            bullet.element.style.top = `${bullet.y}px`;
            // 请求下一帧动画，继续更新子弹位置
            requestAnimationFrame(animate);
        };
        // 启动动画函数
        animate();
    }
}

// 初始化坦克
const tankElement = document.getElementById('tank');
const tank = new Tank(tankElement);

// 文字提示淡出
setTimeout(() => {
    document.getElementById('instructions').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('instructions').style.display = 'none';
    }, 1000);
}, 10000);  

// 键盘事件监听
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true; // 使用 e.code 替代 e.key

    if (e.code === 'Space') {
        e.preventDefault(); // 阻止默认滚动行为
        if (!tank.isSpacePressed) {
            tank.isSpacePressed = true;
            tank.fireBullet();
            tank.bulletInterval = setInterval(() => tank.fireBullet(), 200);
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false; // 使用 e.code 替代 e.key

    if (e.code === 'Shift') {
        tank.speed = tank.baseSpeed;
    }
    if (e.code === 'Space') {
        e.preventDefault(); // 保持行为一致
        tank.isSpacePressed = false;
        clearInterval(tank.bulletInterval);
    }
});

// 游戏循环
setInterval(() => {
    if (keys['ArrowUp']) tank.moveForward();
    if (keys['ArrowDown']) tank.moveBackward();
    if (keys['ArrowLeft']) tank.rotateLeft();
    if (keys['ArrowRight']) tank.rotateRight();
    if (keys['ShiftLeft'] || keys['ShiftRight']) tank.speed = tank.boostSpeed; // 适配左右Shift
}, 16);


class Enemy {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'enemy';
        document.getElementById('game-container').appendChild(this.element);
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.updatePosition();
    }

    /**
     * 更新敌人元素在页面上的位置。
     * 该方法会根据敌人实例的 x 和 y 坐标，设置敌人元素的 `left` 和 `top` 样式属性，
     * 从而将敌人元素移动到对应的位置。
     */
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    /**
     * 让敌人朝着坦克的位置移动。
     * 该方法会计算敌人与坦克之间的距离和方向，然后根据敌人的移动速度更新敌人的位置。
     * 
     * @param {number} tankX - 坦克的 x 坐标。
     * @param {number} tankY - 坦克的 y 坐标。
     */
    moveToward(tankX, tankY) {
        // 计算敌人与坦克在 x 轴上的距离差
        const dx = tankX - this.x;
        // 计算敌人与坦克在 y 轴上的距离差
        const dy = tankY - this.y;
        // 计算敌人与坦克之间的直线距离
        const distance = Math.sqrt(dx * dx + dy * dy);
        // 若敌人与坦克之间存在距离，则进行移动操作
        if (distance > 0) {
            // 计算敌人在 x 轴上的移动量，并更新敌人的 x 坐标
            this.x += (dx / distance) * this.speed;
            // 计算敌人在 y 轴上的移动量，并更新敌人的 y 坐标
            this.y += (dy / distance) * this.speed;
            // 调用更新位置的方法，将敌人元素移动到新的位置
            this.updatePosition();
        }
    }

    destroy() {
        this.element.remove();
    }
}

const enemies = [];

/**
 * 生成一个新的敌人实例，并将其添加到游戏中。
 * 该函数会在游戏窗口内随机生成一个位置，然后在该位置创建一个新的敌人对象，
 * 最后将这个敌人对象添加到全局的敌人数组中。
 */
function spawnEnemy() {
    // 随机生成敌人的 x 坐标，范围是游戏窗口的宽度
    const x = Math.random() * window.innerWidth;
    // 随机生成敌人的 y 坐标，范围是游戏窗口的高度
    const y = Math.random() * window.innerHeight;
    // 使用随机生成的坐标创建一个新的敌人实例
    const enemy = new Enemy(x, y);
    // 将新创建的敌人实例添加到全局的敌人数组中
    enemies.push(enemy);
}

/**
 * 检查子弹是否击中敌人。
 * 该函数会遍历坦克发射的所有子弹和游戏中的所有敌人，
 * 计算每颗子弹与每个敌人之间的距离，若距离小于 20 像素，则认为子弹击中了敌人。
 * 当子弹击中敌人时，会销毁敌人和子弹，并从对应的数组中移除它们。
 */
function checkBulletHits() {
    // 遍历坦克发射的所有子弹
    tank.bullets.forEach(bullet => {
        // 遍历游戏中的所有敌人
        enemies.forEach((enemy, index) => {
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            // 计算子弹与敌人之间的直线距离
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 若子弹与敌人的距离小于 20 像素，则认为子弹击中了敌人
            if (distance < 20) {
                // 调用敌人的销毁方法，从 DOM 中移除敌人元素
                enemy.destroy();
                // 从敌人数组中移除被击中的敌人
                enemies.splice(index, 1);
                // 从 DOM 中移除被击中的子弹元素
                bullet.element.remove();
                // 从坦克的子弹数组中过滤掉已击中的子弹
                tank.bullets = tank.bullets.filter(b => b !== bullet);
            }
        });
    });
}

function updateEnemies() {
    enemies.forEach(enemy => enemy.moveToward(tank.x, tank.y));
    checkBulletHits();
}

setInterval(() => {
    updateEnemies();
}, 100);

// 初始生成几个敌人
spawnEnemy();
spawnEnemy();
spawnEnemy();