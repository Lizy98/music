
// 音乐数据
const songs = [
     {
        title: "透明だった世界 (曾经透明的世界）",
        artist: "秦基博",
        src: "music/透明だった世界 (曾经透明的世界）－秦基博.mp3",
        cover: "image/哪路多.png",
        duration: "3:53"
    },
    {
        title: "Love 119",
        artist: "RIIZE",
        src: "music/Love 119-RIIZE.mp3",
        cover: "image/119.png",
        duration: "2:53"
    },
    {
        title: "遊生夢死",
        artist: "Eve",
        src: "music/Eve - 遊生夢死.mp3",
        cover: "image/Eve.png",
        duration: "3:14"
    },
    {
        title: "悪魔の子 (恶魔之子)",
        artist: "ヒグチアイ",
        src: "music/ヒグチアイ - 悪魔の子 (恶魔之子).mp3",
        cover: "image/巨人.png",
        duration: "3:47"
    },
    {
        title: "红豆",
        artist: "方大同",
        src: "music/红豆-方大同.mp3",
        cover: "image/红豆.png",
        duration: "3:56"
    }
];

// 获取DOM元素
const audioPlayer = document.getElementById('audioPlayer');
const vinyl = document.getElementById('vinyl');
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeLevel = document.getElementById('volumeLevel');
const playlistItems = document.getElementById('playlistItems');
const playlistCount = document.getElementById('playlistCount');
const playlistSection = document.getElementById('playlistSection');
const playlistToggleBtn = document.getElementById('playlistToggleBtn');
const closePlaylistBtn = document.getElementById('closePlaylistBtn');
const speedControlBtn = document.getElementById('speedControlBtn');
const speedMenu = document.getElementById('speedMenu');
const currentSpeed = document.getElementById('currentSpeed');
const speedOptions = document.querySelectorAll('.speed-option');

// 当前播放索引
let currentSongIndex = 0;
let isPlaying = false;
let currentPlaybackRate = 1.0;
let rotationAngle = 0;
let animationStartTime = 0;
let animationId = null;

// 初始化播放器
function initPlayer() {
    // 设置初始歌曲
    loadSong(currentSongIndex);
    
    // 生成播放列表
    generatePlaylist();
    
    // 更新播放列表计数
    updatePlaylistCount();
    
    // 设置音量和播放速度
    audioPlayer.volume = 0.7;
    audioPlayer.playbackRate = currentPlaybackRate;
}

// 加载歌曲
function loadSong(index) {
    const song = songs[index];
    
    audioPlayer.src = song.src;
    albumCover.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    
    // 保持当前的播放速度
    audioPlayer.playbackRate = currentPlaybackRate;
    
    // 更新播放列表中的活动项
    updateActivePlaylistItem(index);
    
    // 重置旋转角度
    rotationAngle = 0;
    vinyl.style.transform = `rotate(${rotationAngle}deg)`;
    
    // 如果正在播放，继续播放
    if (isPlaying) {
        startVinylRotation();
    }
}

// 生成播放列表
function generatePlaylist() {
    playlistItems.innerHTML = '';
    
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        if (index === currentSongIndex) {
            playlistItem.classList.add('active');
        }
        
        playlistItem.innerHTML = `
            <div class="playlist-item-index">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            if (!isPlaying) {
                togglePlay();
            }
            // 选择歌曲后关闭播放列表
            closePlaylist();
        });
        
        playlistItems.appendChild(playlistItem);
    });
}

// 更新播放列表中的活动项
function updateActivePlaylistItem(index) {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 更新播放列表计数
function updatePlaylistCount() {
    playlistCount.textContent = `${songs.length}首歌曲`;
}

// 切换播放/暂停
function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
        stopVinylRotation();
    } else {
        audioPlayer.play();
        playIcon.className = 'fas fa-pause';
        startVinylRotation();
    }
    isPlaying = !isPlaying;
}

// 开始唱片旋转
function startVinylRotation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    animationStartTime = Date.now();
    rotateVinyl();
}

// 停止唱片旋转
function stopVinylRotation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// 唱片旋转动画
function rotateVinyl() {
    const now = Date.now();
    const elapsed = now - animationStartTime;
    
    // 根据播放速度计算旋转角度
    const newAngle = rotationAngle + (elapsed * 0.012 * currentPlaybackRate); // 0.012度/毫秒 ≈ 720度/分钟
    rotationAngle = newAngle % 360;
    
    vinyl.style.transform = `rotate(${rotationAngle}deg)`;
    
    animationStartTime = now;
    animationId = requestAnimationFrame(rotateVinyl);
}

// 播放上一曲
function playPrev() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (!isPlaying) {
        togglePlay();
    }
}

// 播放下一曲
function playNext() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (!isPlaying) {
        togglePlay();
    }
}

// 打开播放列表
function openPlaylist() {
    playlistSection.style.display = 'block';
    // 关闭倍速菜单
    speedMenu.classList.remove('show');
}

// 关闭播放列表
function closePlaylist() {
    playlistSection.style.display = 'none';
}

// 切换倍速菜单显示/隐藏
function toggleSpeedMenu() {
    // 切换倍速菜单显示状态
    speedMenu.classList.toggle('show');
    
    // 如果播放列表打开，先关闭它
    if (playlistSection.style.display === 'block') {
        closePlaylist();
    }
}

// 设置播放速度
function setPlaybackRate(speed) {
    currentPlaybackRate = speed;
    audioPlayer.playbackRate = speed;
    currentSpeed.textContent = `${speed.toFixed(1)}x`;
    
    // 更新选中状态
    speedOptions.forEach(option => {
        const optionSpeed = parseFloat(option.getAttribute('data-speed'));
        if (Math.abs(optionSpeed - speed) < 0.01) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 如果正在播放，重新开始旋转以应用新的速度
    if (isPlaying) {
        stopVinylRotation();
        startVinylRotation();
    }
}

// 更新进度条
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // 更新时间显示
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

// 设置进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
}

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// 设置音量
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    
    audioPlayer.volume = volume;
    volumeLevel.style.width = `${volume * 100}%`;
}

// 事件监听
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', playNext);
progressBar.addEventListener('click', setProgress);
volumeLevel.parentElement.addEventListener('click', setVolume);
playlistToggleBtn.addEventListener('click', openPlaylist);
closePlaylistBtn.addEventListener('click', closePlaylist);

// 倍速控制相关事件
speedControlBtn.addEventListener('click', toggleSpeedMenu);

// 点击倍速选项
speedOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        const speed = parseFloat(option.getAttribute('data-speed'));
        setPlaybackRate(speed);
        speedMenu.classList.remove('show'); // 选择后关闭菜单
    });
});

// 点击文档其他地方关闭倍速菜单和播放列表
document.addEventListener('click', (e) => {
    // 关闭倍速菜单（如果点击的不是速度控制按钮或其子元素）
    if (!speedControlBtn.contains(e.target)) {
        speedMenu.classList.remove('show');
    }
    
    // 关闭播放列表
    if (playlistSection.style.display === 'block' && 
        !playlistSection.contains(e.target) && 
        !playlistToggleBtn.contains(e.target)) {
        closePlaylist();
    }
});

// 初始化播放器
initPlayer();
