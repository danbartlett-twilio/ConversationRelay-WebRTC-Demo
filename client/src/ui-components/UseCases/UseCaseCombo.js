import { useState, useEffect } from "react";
import axios from "axios";

import {
  FormControl,
  Label,
  Box,
  Select,
  Option,
  HelpText,
  Modal,
  ModalHeader,
  ModalHeading,
  ModalBody,
  Paragraph,
  Grid,
  Column,
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
    // set selected parameters based on the selected user configuration
    setSelectedSttProvider(
      props.selectedUseCase?.value.conversationRelayParams?.transcriptionProvider
    );
    setSelectedTtsProvider(
      props.selectedUseCase?.value.conversationRelayParams?.ttsProvider
    );
    setSelectedVoice(
      props.selectedUseCase?.value.conversationRelayParams?.voice
    );
    // set the speech model based on the selected use case
    if(props.selectedUseCase?.value.conversationRelayParams?.transcriptionProvider ===
    "Google") {
      setSpeechModel("telephony"); 
      props.propertyChange('speechModel', "telephony")
    } else {
      setSpeechModel("nova-2-general");
      props.propertyChange('speechModel', "nova-2-general")
    }

    props.uiChange()
  }, [ props.selectedUseCase]);

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
              props.selectedUseCase?.value.conversationRelayParams?.ttsProvider
          );
          console.log("providerVoices", providerVoices);
          setSelectedVoices(providerVoices);
          setSelectedVoice(
            props.selectedUseCase?.value.conversationRelayParams?.voice
          );
        });
      } catch (error) {
        console.error("Error fetching voices: ", error);
      }
    };
    getVoices();
  }, [props.selectedUseCase]);

  // handler updating the stt provider selection
  const handle_SttChange = (e) => {
    props.uiChange(true)
    setSelectedSttProvider(e.target.value);
    props.propertyChange('sttProvider', e.target.value)
    if(e.target.value === "Google") {
      setSpeechModel("telephony"); 
      props.propertyChange('speechModel', "telephony")
    }else {
      setSpeechModel("nova-2-general");
      props.propertyChange('speechModel', "nova-2-general")
    }
  };

  // handler updating the tts provider selection
  const handle_TtsChange = (e) => {
    props.uiChange(true)
    const selectedValue = e.target.value;
    const selectedVoice = voices.find((voice) => voice.key === selectedValue);
    if (selectedVoice) {
      setSelectedTtsProvider(selectedValue);
      setSelectedVoices(selectedVoice);
      setSelectedVoice(selectedVoice?.value[0]?.value);

      props.propertyChange('ttsProvider', selectedValue)
      props.propertyChange('voice', selectedVoice?.value[0]?.value)
    }
  };

  // handler updating the voice selection
  const handle_VoiceChange = (e) => {
    props.uiChange(true)
    setSelectedVoice(e.target.value);
    props.propertyChange('voice', e.target.value)
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
    <div>
      <FormControl>
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
              disabled={props.disabled}
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
              disabled={props.disabled}
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
              disabled={props.disabled}
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
    </div>
  );
  return layout;
};
export default UseCaseCombo;
