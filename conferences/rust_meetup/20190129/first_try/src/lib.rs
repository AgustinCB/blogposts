trait InputDevice {}
trait OutputDevice {}

struct ButtonDevice {}
impl InputDevice for ButtonDevice {}

struct SoundDevice {}
impl OutputDevice for SoundDevice {}


struct Cpu {
    inputs: Vec<Box<InputDevice>>,
    outputs: Vec<Box<OutputDevice>>,
}

struct Console {
    cpu: Cpu,
    sounds: Vec<SoundDevice>,
    buttons: Vec<ButtonDevice>,
}
