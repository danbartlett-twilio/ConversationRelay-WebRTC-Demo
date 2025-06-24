import { useState, useEffect } from "react";
import axios from "axios";

import {
  Form,
  FormControl,
  Label,
  Box,
  Select,
  Option,
  Card,
  Button,
  HelpText,
  Modal,
  ModalHeader,
  ModalHeading,
  ModalBody,
  Paragraph,
  Grid,
  Column,
  Heading,
} from "@twilio-paste/core";

//  default transcription and tts providers
//  these are used to populate the dropdowns
//  TODO: these should be fetched from the backend
const transcriptionProviders = [
  { name: "Google", value: "Google" },
  { name: "Deepgram", value: "Deepgram" },
];
const ttsProviders = [
  { name: "Google", value: "Google" },
  { name: "Amazon", value: "Amazon" },
  { name: "Eleven Labs", value: "ElevenLabs" },
];

const UseCaseCombo = (props) => {
  // local component state
  const [useCases, setUseCases] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(
    props.useCases[0] || null
  );

  const [voices, setVoices] = useState(null);
  const [selectedVoices, setSelectedVoices] = useState(null);

  const [selectedSttProvider, setSelectedSttProvider] = useState(null);
  const [selectedTtsProvider, setSelectedTtsProvider] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechModel, setSpeechModel] = useState(null);

  //   dialog state for the tts voice support information
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  const [uiChange, setUiChange] = useState(false);

  //    initialize component bases on updates to usecases and selectedUser
  useEffect(() => {
    setUseCases(props.useCases);
    setSelectedUseCase(props.selectedUser?.useCase);

    // set selected parameters based on the selected user configuration
    setSelectedSttProvider(
      props.selectedUser?.conversationRelayParamsOverride?.transcriptionProvider
    );
    setSelectedTtsProvider(
      props.selectedUser?.conversationRelayParamsOverride?.ttsProvider
    );
    setSelectedVoice(
      props.selectedUser?.conversationRelayParamsOverride?.voice
    );
    setSpeechModel(
      props.selectedUser?.conversationRelayParamsOverride?.speechModel
    );
  }, [props.useCases, props.selectedUser]);

  // Fetch all voices from the backend
  useEffect(() => {
    // get all voices from backend ( data > transcriptionProviders.json )
    const getVoices = async () => {
      const voicesURL = process.env.REACT_APP_GET_TRANSCRIPTION_VOICE_URL;

      try {
        // Fetch all voices from the backend
        await axios.get(voicesURL).then((resp) => {
          setVoices(resp.data);
          // set the selected voiced based on the user settings
          const providerVoices = resp.data.find(
            (provider) =>
              provider.key ===
              props.selectedUser?.conversationRelayParamsOverride?.ttsProvider
          );
          setSelectedVoices(providerVoices);
          setSelectedVoice(
            props.selectedUser?.conversationRelayParamsOverride?.voice
          );
        });
      } catch (error) {
        console.error("Error fetching voices: ", error);
      }
    };
    getVoices();
  }, [props.useCases]);

  //    handler updating the use case selection
  const useCaseChange = (e) => {
    setUiChange(true);

    const selectedValue = e.target.value;

    const selectedItem = props.useCases.find(
      (item) => item.key === selectedValue
    );
    console.log("useCaseChange", selectedItem);
    if (selectedItem) {
      setSelectedUseCase(selectedItem.key);
      setSelectedSttProvider(
        selectedItem.value.conversationRelayParams.transcriptionProvider
      );
      setSelectedTtsProvider(
        selectedItem.value.conversationRelayParams.ttsProvider
      );

      const providerVoices = voices.find(
        (provider) =>
          provider.key ===
          selectedItem.value.conversationRelayParams.ttsProvider
      );
      console.log("providerVoices", providerVoices);
      setSelectedVoices(providerVoices);
      const selVoice = providerVoices.value.find(
        (voice) =>
          voice.value === selectedItem.value.conversationRelayParams.voice
      );
      setSelectedVoice(selVoice.value);

      // set 'speech model' based on the selected use case
      selectedItem.value.conversationRelayParams.transcriptionProvider ===
      "Google"
        ? setSpeechModel("telephony")
        : setSpeechModel("nova-2-general");
    }
  };

  // handler updating the stt provider selection
  const handle_SttChange = (e) => {
    setUiChange(true);
    setSelectedSttProvider(e.target.value);
    e.target.value === "Google"
      ? setSpeechModel("telephony")
      : setSpeechModel("nova-2-general");
  };
  // handler updating the tts provider selection
  const handle_TtsChange = (e) => {
    setUiChange(true);
    const selectedValue = e.target.value;
    const selectedVoice = voices.find((voice) => voice.key === selectedValue);
    if (selectedVoice) {
      setSelectedTtsProvider(selectedValue);
      setSelectedVoices(selectedVoice);
      setSelectedVoice(selectedVoice?.value[0]?.value);
    }
  };

  // handler updating the voice selection
  const handle_VoiceChange = (e) => {
    setUiChange(true);
    setSelectedVoice(e.target.value);
  };

  // handler updating the user configuration
  // updateUser forward from main.js
  const handleUpdate = () => {
    setUiChange(false);
    props.updateUser({
      voice: selectedVoice,
      ttsProvider: selectedTtsProvider,
      sttProvider: selectedSttProvider,
      useCase: selectedUseCase,
      speechModel: speechModel,
    });
  };

  // handler showing the tts voice modal dialog
  const handleShowVoiceDialog = (e) => {
    e.preventDefault();
    setShowVoiceDialog(true);
  };

  // handler closing the tts voice modal  dialog
  const handleCloseVoiceDialog = (e) => {
    setShowVoiceDialog(false);
  };

  //  layout for the use case combo
  let layout = (
    <Form>
      <FormControl>
        <Heading as="h1" variant="heading30" marginBottom="space40">
          Bot Configuration
        </Heading>
        <Label htmlFor="useCaseSelect" required>
          Select a Use Case
        </Label>
        <Select
          id="useCaseSelect"
          htmlFor="useCaseSelect"
          value={selectedUseCase}
          onChange={(e) => useCaseChange(e)}
        >
          {useCases?.map((useCase) => {
            return (
              <Option key={useCase.key} value={useCase.key}>
                {useCase.value.title}
              </Option>
            );
          })}
        </Select>
        <Box as="div" marginTop="space40">
          {/* Transcription Provider select component */}
          <Box as={"div"}>
            <Label htmlFor="stt_provider" required>
              Transcription (STT) Provider
            </Label>
            <Select
              id="stt_provider"
              htmlFor="stt_provider"
              value={selectedSttProvider}
              onChange={handle_SttChange}
            >
              {transcriptionProviders.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Box>

          {/* TTS Provider Select */}
          <Box as={"div"} marginTop="20px">
            <Label htmlFor="tts_provider" required>
              Text-to-Speech (TTS) Provider
            </Label>
            <Select
              id="tts_provider"
              htmlFor="tts_provider"
              value={selectedTtsProvider}
              onChange={handle_TtsChange}
            >
              {ttsProviders.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Box>

          {/* Voice select component */}
          <Box as={"div"} marginTop="20px">
            <Label htmlFor="voice" required>
              Voice
            </Label>
            <Select
              id="voice"
              htmlFor="voice"
              value={selectedVoice}
              onChange={handle_VoiceChange}
            >
              {selectedVoices?.value?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
            <HelpText variant="default">
              <Box
                style={{ textDecoration: "none" }}
                as="a"
                href="#"
                onClick={(e) => handleShowVoiceDialog(e)}
              >
                Voice support information
              </Box>
            </HelpText>
          </Box>

          <Box as={"div"} marginTop="20px">
            {uiChange && (
              <Label>
                <span style={{ color: "red" }}>Configuration has changed</span>
              </Label>
            )}
          </Box>

          <Box as={"div"} marginTop="20px">
            <Button
              style={{ float: "right" }}
              disabled={!uiChange}
              variant={uiChange ? "destructive" : "primary"}
              onClick={(e) => handleUpdate(e)}
            >
              Save Configuration
            </Button>
          </Box>
        </Box>
      </FormControl>

      <Modal
        ariaLabelledby={"voiceDialog"}
        isOpen={showVoiceDialog}
        onDismiss={(e) => handleCloseVoiceDialog(e)}
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={"voiceDialog"}>
            Conversation Relay: TTS Voice Support
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Paragraph>
            Conversation Relay supports a wide variety of TTS voices (2000+)
            from several providers (Google, Amazon and Eleven Labs).
          </Paragraph>
          <Paragraph>
            This demo highlights only a small subset of the available voices.
          </Paragraph>
          <Paragraph>
            For complete details on supported providers and genders, languages
            and voice support, please refer to the product documentation.
          </Paragraph>
          <Grid gutter="space40" marginTop="space40">
            <Column span={6}>
              <Box as="div" style={{ textAlign: "center" }}>
                <Box
                  as="a"
                  href="https://www.twilio.com/docs/voice/twiml/say/text-speech#available-voices-and-languages"
                  target="_blank"
                >
                  Google and Amazon Voices
                </Box>
              </Box>
            </Column>
            <Column span={6}>
              <Box as="div" style={{ textAlign: "center" }}>
                <Box
                  as="a"
                  href="https://www.twilio.com/docs/voice/twiml/connect/conversationrelay#additional-tts-voices-available-for-conversationrelay"
                  target="_blank"
                >
                  Eleven Labs Voices
                </Box>
              </Box>
            </Column>
          </Grid>
          <Paragraph>&nbsp;</Paragraph>
        </ModalBody>
      </Modal>
    </Form>
  );
  return layout;
};
export default UseCaseCombo;
