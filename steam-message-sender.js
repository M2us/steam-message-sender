// Paste this script into the Steam profile page console.
const UI_TEMPLATE = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #6e7dff, #00b8d4); padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);">
    <h1 style="color: #fff; text-align: center; font-size: 30px; margin-bottom: 30px;">Steam Message Sender</h1>

    <div style="margin-bottom: 20px;">
      <label for="profileId" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Recipient Profile ID:</label>
      <input type="text" id="profileId" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 20px;">
      <label for="sessionId" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Your Session ID:</label>
      <input type="text" id="sessionId" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 20px;">
      <label for="message" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Message:</label>
      <textarea id="message" rows="6" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;"></textarea>
    </div>

    <div style="margin-bottom: 30px;">
      <label for="messageCount" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Number of Messages:</label>
      <input type="number" id="messageCount" min="1" value="10" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 30px;">
      <label for="delay" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Delay Between Messages (seconds):</label>
      <input type="number" id="delay" min="1" value="20" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 30px;">
      <label for="retryDelay" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Retry Delay (seconds):</label>
      <input type="number" id="retryDelay" value="90" min="1" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 30px;">
      <label for="retryStep" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Increase Delay Between Retries (seconds):</label>
      <input type="number" id="retryStep" min="1" value="20" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <div style="margin-bottom: 30px;">
      <label for="maxRetryRounds" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #fff;">Max Retry Rounds:</label>
      <input type="number" id="maxRetryRounds" min="1" value="10" style="width: calc(100% - 20px); padding: 12px; border-radius: 8px; border: 1px solid #ddd; background-color: #fff; font-size: 16px; color: #333; box-sizing: border-box;">
    </div>

    <button id="startButton" style="width: 100%; padding: 15px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; transition: background-color 0.3s ease;">
      Start Sending
    </button>

    <button id="pauseButton" style="width: 100%; padding: 15px; margin-top: 10px; background-color: #ff9800; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; transition: background-color 0.3s ease;">
      Pause
    </button>

    <button id="stopButton" style="width: 100%; padding: 15px; margin-top: 10px; background-color: #f44336; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; transition: background-color 0.3s ease;">
      Stop
    </button>

    <div style="margin-top: 15px; padding: 10px; border: 1px dashed #ddd; border-radius: 8px; background-color: #fff; font-size: 14px; color: #333;" id="progress">
      <strong>Progress:</strong> 0 / 0 sent
    </div>

    <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff; height: 200px; overflow-y: auto; font-size: 14px; color: #333;" id="log">
      <p><strong>Logs:</strong></p>
    </div>
  </div>
`;

const SENDING_LABEL = 'Sending <span class="loading-dots"><span></span><span></span><span></span></span>';

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

function msToTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes) {
    return `${minutes} minute(s) and ${seconds} second(s)`;
  }

  return `${seconds} second(s)`;
}

function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString();
}

function resetFieldValidation(fieldId) {
  const field = document.getElementById(fieldId);
  const errorText = document.getElementById(`${fieldId}-error`);

  field.style.border = "1px solid #ddd";

  if (errorText) {
    errorText.remove();
  }
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorMessage = document.createElement("div");

  field.style.border = "1px solid red";

  errorMessage.id = `${fieldId}-error`;
  errorMessage.style.color = "red";
  errorMessage.style.fontSize = "12px";
  errorMessage.textContent = message;

  field.parentNode.appendChild(errorMessage);
}

function createLogger(logContainer) {
  const append = (color, message) => {
    logContainer.insertAdjacentHTML(
      "beforeend",
      `<p style="color: ${color};">[${getCurrentTime()}] ${message}</p>`
    );
    logContainer.scrollTop = logContainer.scrollHeight;
  };

  return {
    clear() {
      logContainer.innerHTML = "<p><strong>Logs:</strong></p>";
    },
    info(message) {
      append("#333", message);
    },
    success(message) {
      append("green", message);
    },
    warn(message) {
      append("orange", message);
    },
    error(message) {
      append("red", message);
    }
  };
}

function renderUI() {
  document.body.innerHTML = UI_TEMPLATE;
}

function getElements() {
  return {
    profileId: document.getElementById("profileId"),
    sessionId: document.getElementById("sessionId"),
    message: document.getElementById("message"),
    messageCount: document.getElementById("messageCount"),
    delay: document.getElementById("delay"),
    retryDelay: document.getElementById("retryDelay"),
    retryStep: document.getElementById("retryStep"),
    maxRetryRounds: document.getElementById("maxRetryRounds"),
    startButton: document.getElementById("startButton"),
    pauseButton: document.getElementById("pauseButton"),
    stopButton: document.getElementById("stopButton"),
    progress: document.getElementById("progress"),
    log: document.getElementById("log")
  };
}

function setButtonState(button, isLoading) {
  if (isLoading) {
    button.innerHTML = SENDING_LABEL;
    button.disabled = true;
  } else {
    button.innerHTML = "Start Sending";
    button.disabled = false;
  }
}

function setStopButtonState(button, isEnabled) {
  button.disabled = !isEnabled;
}

function setPauseButtonState(button, isEnabled, isPaused) {
  button.disabled = !isEnabled;
  button.textContent = isPaused ? "Resume" : "Pause";
}

function updateProgress(progressElement, progress) {
  const status = progress.paused ? "paused" : "running";
  progressElement.innerHTML =
    `<strong>Progress:</strong> ${progress.sent} / ${progress.total} / ${progress.failed} ` +
    `failed | Round: ${progress.round} | ${status}`;
}

async function waitWhilePaused(pauseSignal, stopSignal) {
  while (pauseSignal.paused && !stopSignal.stop) {
    await sleep(200);
  }
}

function getInputValues(elements) {
  return {
    profileId: elements.profileId.value.trim(),
    sessionId: elements.sessionId.value.trim(),
    baseMessage: elements.message.value.trim(),
    messageCount: parseInt(elements.messageCount.value, 10),
    delayMs: parseInt(elements.delay.value, 10) * 1000,
    retryDelayMs: parseInt(elements.retryDelay.value, 10) * 1000,
    retryStepMs: parseInt(elements.retryStep.value, 10) * 1000,
    maxRetryRounds: parseInt(elements.maxRetryRounds.value, 10)
  };
}

function validateInputs(values) {
  const errors = {};

  if (!values.profileId) {
    errors.profileId = "Recipient Profile ID is required.";
  }

  if (!values.sessionId) {
    errors.sessionId = "Your Session ID is required.";
  }

  if (!values.baseMessage) {
    errors.message = "Message is required.";
  }

  if (!Number.isFinite(values.messageCount) || values.messageCount < 1) {
    errors.messageCount = "Message count must be a number and at least 1.";
  }

  if (!Number.isFinite(values.delayMs) || values.delayMs < 1000) {
    errors.delay = "Delay must be a number and at least 1 second.";
  }

  if (!Number.isFinite(values.retryDelayMs) || values.retryDelayMs < 1000) {
    errors.retryDelay = "Retry delay must be a number and at least 1 second.";
  }

  if (!Number.isFinite(values.retryStepMs) || values.retryStepMs < 1000) {
    errors.retryStep = "Retry step must be a number and at least 1 second.";
  }

  if (!Number.isFinite(values.maxRetryRounds) || values.maxRetryRounds < 1) {
    errors.maxRetryRounds = "Max retry rounds must be a number and at least 1.";
  }

  return errors;
}

function applyValidationErrors(errors) {
  Object.entries(errors).forEach(([fieldId, message]) => showFieldError(fieldId, message));
}

async function postMessage({ url, baseMessage, sessionId, messageNumber, logger }) {
  const data = new URLSearchParams();

  data.append("comment", baseMessage);
  data.append("count", "1");
  data.append("sessionid", sessionId);
  data.append("feature2", "-1");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: "include",
      body: data.toString()
    });

    const responseText = await response.text();
    let responseData = null;

    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = null;
    }

    if (response.ok && responseData && responseData.success) {
      logger.success(`Message ${messageNumber} sent successfully.`);

      return true;
    }

    const details = responseData ? JSON.stringify(responseData) : responseText.slice(0, 200);
    logger.error(`Error sending message ${messageNumber}: ${details || "Unknown error"}`);

    return false;
  } catch (error) {
    logger.error(`Error sending message ${messageNumber}: ${error.message}`);

    return false;
  }
}

async function sendBatch({ requests, delayMs, post, stopSignal, pauseSignal, progress }) {
  const failed = [];

  for (let i = 0; i < requests.length; i++) {
    if (stopSignal.stop) {
      return { failed, aborted: true };
    }

    await waitWhilePaused(pauseSignal, stopSignal);
    if (stopSignal.stop) {
      return { failed, aborted: true };
    }

    const messageNumber = requests[i];
    const isSent = await post(messageNumber);

    if (!isSent) {
      failed.push(messageNumber);
      progress.failed += 1;
    } else {
      progress.sent += 1;
    }
    updateProgress(progress.element, progress);

    if (i < requests.length - 1) {
      if (stopSignal.stop) {
        return { failed, aborted: true };
      }
      await waitWhilePaused(pauseSignal, stopSignal);
      if (stopSignal.stop) {
        return { failed, aborted: true };
      }
      await sleep(delayMs);
    }
  }

  return { failed, aborted: false };
}

async function sendMessages(values, logger, stopSignal, pauseSignal, progress) {
  const url = `https://steamcommunity.com/comment/Profile/post/${values.profileId}/-1/`;
  const post = (messageNumber) =>
    postMessage({
      url,
      baseMessage: values.baseMessage,
      sessionId: values.sessionId,
      messageNumber,
      logger
    });

  updateProgress(progress.element, progress);

  const requests = Array.from({ length: values.messageCount }, (_, index) => index + 1);
  let batchResult = await sendBatch({
    requests,
    delayMs: values.delayMs,
    post,
    stopSignal,
    pauseSignal,
    progress
  });

  if (batchResult.aborted) {
    logger.warn("Stopped by user.");
    return;
  }

  let failedRequests = batchResult.failed;

  logger.success(
    `Sent: ${values.messageCount - failedRequests.length} | Failed: ${failedRequests.length}`
  );

  let currentDelay = values.retryDelayMs;
  let retryRound = 1;

  while (failedRequests.length > 0) {
    if (stopSignal.stop) {
      logger.warn("Stopped by user.");
      return;
    }

    if (retryRound > values.maxRetryRounds) {
      logger.error(`Max retries reached. Failed: ${failedRequests.length}`);
      return;
    }

    progress.round = retryRound + 1;
    updateProgress(progress.element, progress);
    logger.warn(`Retrying (${retryRound}) in ${msToTime(currentDelay)}...`);
    await sleep(currentDelay);

    batchResult = await sendBatch({
      requests: failedRequests,
      delayMs: values.delayMs,
      post,
      stopSignal,
      pauseSignal,
      progress
    });

    if (batchResult.aborted) {
      logger.warn("Stopped by user.");
      return;
    }

    failedRequests = batchResult.failed;

    if (failedRequests.length === 0) {
      logger.success("Retry process completed. All messages sent.");
      return;
    }

    retryRound += 1;
    currentDelay += values.retryStepMs;
  }
}

function init() {
  renderUI();

  const elements = getElements();
  const logger = createLogger(elements.log);
  const stopSignal = { stop: false };
  const pauseSignal = { paused: false };
  let activeProgress = null;
  const fieldsToReset = [
    "profileId",
    "sessionId",
    "message",
    "messageCount",
    "delay",
    "retryDelay",
    "retryStep",
    "maxRetryRounds"
  ];

  setStopButtonState(elements.stopButton, false);
  setPauseButtonState(elements.pauseButton, false, false);
  updateProgress(elements.progress, {
    total: 0,
    sent: 0,
    failed: 0,
    round: 0,
    paused: false
  });

  fieldsToReset.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.addEventListener("input", () => resetFieldValidation(fieldId));
  });

  elements.stopButton.addEventListener("click", () => {
    stopSignal.stop = true;
    pauseSignal.paused = false;
    setPauseButtonState(elements.pauseButton, false, false);
    setStopButtonState(elements.stopButton, false);
    logger.warn("Stop requested. Finishing current request...");
  });

  elements.pauseButton.addEventListener("click", () => {
    pauseSignal.paused = !pauseSignal.paused;
    setPauseButtonState(elements.pauseButton, true, pauseSignal.paused);
    if (activeProgress) {
      activeProgress.paused = pauseSignal.paused;
      updateProgress(activeProgress.element, activeProgress);
    }
    logger.warn(pauseSignal.paused ? "Paused." : "Resumed.");
  });

  elements.startButton.addEventListener("click", async () => {
    logger.clear();
    fieldsToReset.forEach(resetFieldValidation);

    const values = getInputValues(elements);
    const errors = validateInputs(values);

    if (Object.keys(errors).length > 0) {
      applyValidationErrors(errors);
      logger.error("Please fill all fields correctly.");
      return;
    }

    setButtonState(elements.startButton, true);
    setStopButtonState(elements.stopButton, true);
    setPauseButtonState(elements.pauseButton, true, false);
    stopSignal.stop = false;
    pauseSignal.paused = false;

    try {
      activeProgress = {
        total: values.messageCount,
        sent: 0,
        failed: 0,
        round: 1,
        paused: false,
        element: elements.progress
      };
      updateProgress(activeProgress.element, activeProgress);
      await sendMessages(values, logger, stopSignal, pauseSignal, activeProgress);
    } finally {
      setButtonState(elements.startButton, false);
      setStopButtonState(elements.stopButton, false);
      setPauseButtonState(elements.pauseButton, false, false);
      if (activeProgress) {
        activeProgress.paused = false;
        updateProgress(activeProgress.element, activeProgress);
        activeProgress = null;
      }
    }
  });
}

init();
