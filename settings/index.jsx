console.log("Opening BART Settings page");


function mySettings(props) {
  return (
    <Page>
      <Section>
        <TextInput
          label="Hass URL"
          title="Hass URL"
          settingsKey="HassUrl"
        />
        <TextInput
          label="Hass PW"
          title="Hass PW"
          settingsKey="HassPw"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);