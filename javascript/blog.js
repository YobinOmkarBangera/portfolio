document.getElementById('likeButton').addEventListener('click', function() {
    let likeCount = document.getElementById('likeCount');
    let currentCount = parseInt(likeCount.textContent);
    likeCount.textContent = currentCount + 1;
});
