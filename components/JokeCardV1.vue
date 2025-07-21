<template>
    <div class="joke-card">
        <div class="joke-text">{{ joke }}</div>
        <div class="joke-footer">
            <span class="text-teal-400 ">@{{ username }}</span>
            <div class="actions">
                <span class="laughs">
                    <UiIcon name="laughing" class="icon" />
                    <span class="count">20k laughs</span>
                </span>
                <button class="share-btn" @click="shareJoke">
                    <UiIcon name="share" class="icon" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const joke = 'Why did the scarecrow win an award? Because he was outstanding in his field!';
const username = 'jokester';

function shareJoke() {
    // Dummy share function
    alert('Joke shared!');
}
</script>

<style scoped>
.joke-card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 20px;
    background: #fff;
    max-width: 400px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.joke-text {
    font-size: 1.1rem;
    margin-bottom: 16px;
    color: #333;
}
.joke-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.username {
    font-weight: 600;
    color: #888;
}
.actions {
    display: flex;
    align-items: center;
    gap: 16px;
}
.laughs {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f7b731;
    font-weight: 500;
}
.icon {
    font-size: 1.2em;
}
.share-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}
</style>